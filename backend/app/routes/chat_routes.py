import os
from flask import Blueprint, request, jsonify
from openai import OpenAI
from openai.types.chat import ChatCompletion
from app.utils import token_required
from dotenv import load_dotenv
from ..models import db, Chatbot, FaceImage, User

load_dotenv()
bp = Blueprint('chat_routes', __name__, url_prefix='/api/chat')

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

# 대화 요약 
def summarize_text(dialog, user_id):
    user = User.query.filter_by(id=user_id).first()
    user_nickname = user.nickname

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": (
                f"다음 대화를 요약하세요. 아래 형식을 따르세요:\n"
                f"감정: {user_nickname}님의 감정을 딱 한 단어로 적어주세요\n"
                f"Chatty가 {user_nickname}님에게 위로를 건넨 방식이나 말을 한 문장 이내로 설명해주세요"
            )},
            {"role": "user", "content": dialog}
        ],
        temperature=0.1,
        max_tokens=200
    )
    summary = response.choices[0].message.content.strip()
    return summary

@bp.route('/', methods=['POST'])
@token_required
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        
       # 상담 시 사용자 닉네임 사용 
        user_id = request.current_user['sub']
        user = User.query.filter_by(id=user_id).first()
        user_nickname = user.nickname

        # 초기 응답 요청인지 확인
        if "초기 응답 요청" in user_message:
            system_content = (
                f"'안녕하세요 {user_nickname}님, 저는 {user_nickname}님의 감정을 케어해주는 심리 상담 챗봇, '채티'입니다.'로 심리 상담의 시작을 알리세요"
            )
        else:
            system_content = (
                f"사용자의 이름은 {user_nickname}입니다. "
                "인사를 생략하고 바로 심리 상담을 시작해주세요."
                "사용자가 행복한 경우 공감의 말을 건네며 행복 이외에 다른 감정을 느끼고 있지는 않은지 확인하세요. 또한, 사용자가 감정을 자각하고 관리할 수 있게 도와주세요."
                "사용자가 화난, 혐오스러운, 두려운, 슬픈 경우에는 사용자의 감정에 맞는 위로의 말을 건네고 사용자가 자신의 감정을 해소하고 관리하는 능력을 기를 수 있는 대답을 하세요."
                "사용자가 놀란 경우, 부정적인 의미의 놀라움이므로, 사용자의 감정에 맞는 위로의 말을 건네고 사용자가 감정을 스스로 관리할 수 있게 도와주세요."
                "상황에 맞는 이모티콘을 적절하게 사용하여 대답을 생성해주세요."
            )

        # OpenAI Chat Completion 요청
        response: ChatCompletion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": user_message},
            ],
            temperature=0.6
        )

        # 응답에서 텍스트 추출
        gpt_response = response.choices[0].message.content.strip()

        return jsonify({"response": gpt_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/save', methods=['POST'])
@token_required
def save_chat():
    try:
        data = request.json
        dialog = data.get('dialog')
        user_id = request.current_user['sub']  

        # 대화 저장 시 요약
        summary = summarize_text(dialog, user_id)

        latest_faceimage = FaceImage.query.filter_by(user_id=user_id).order_by(FaceImage.uploaded_at.desc()).first()

        faceimage_id = latest_faceimage.id if latest_faceimage else None

        new_chatbot = Chatbot(
            summary = summary,
            dialog=dialog,
            user_id=user_id,
            faceimage_id=faceimage_id
        )

        db.session.add(new_chatbot)
        db.session.commit()

        return jsonify({"message": "상담기록 저장 완료"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route('/review', methods=['POST'])
@token_required
def review():
    try:
        data = request.json
        feedback = data.get('feedback')
        user_id = request.current_user['sub']  

        if not feedback:
            return jsonify({"error": "Feedback is required"}), 400

        latest_chatbot = Chatbot.query.filter_by(user_id=user_id).order_by(Chatbot.date.desc()).first()

        if latest_chatbot is None:
            return jsonify({"error": "채팅을 찾을 수 없습니다"}), 404

        latest_chatbot.feedback = feedback
        db.session.commit()

        return jsonify({"message": "피드백 저장 완료"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@bp.route('/list', methods=['GET'])
@token_required
def get_chat_history():
    try:
        user_id = request.current_user['sub']
        chats = Chatbot.query.filter_by(user_id=user_id).order_by(Chatbot.date.desc()).all()
        
        chat_list = [
            {
                "id": chat.id,
                "summary": chat.summary,
                "date": chat.date.strftime('%Y-%m-%d %H:%M'),
                "image": f'http://localhost:5000/api/face_image/download/{chat.faceimage_id}' if chat.faceimage_id else None
            }
            for chat in chats
        ]
        
        return jsonify(chat_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/list/<int:chat_id>', methods=['GET'])
@token_required
def get_chat_by_id(chat_id):
    try:
        chat = Chatbot.query.filter_by(id=chat_id).first()

        if chat is None:
            return jsonify({"error": "해당 ID에 대한 대화 기록을 찾을 수 없습니다."}), 404

        return jsonify({
            "dialog": chat.dialog.split('\n'), 
            "date": chat.date.strftime('%Y-%m-%d %H:%M')
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/delete/<int:chat_id>', methods=['DELETE'])
@token_required
def delete_chat(chat_id):
    try:
        chat = Chatbot.query.filter_by(id=chat_id).first()

        if chat is None:
            return jsonify({"error": "해당 ID에 대한 대화 기록을 찾을 수 없습니다."}), 404

        db.session.delete(chat)
        db.session.commit()

        return jsonify({"message": "대화 기록이 성공적으로 삭제되었습니다."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500