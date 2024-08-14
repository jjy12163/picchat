import os
from flask import Blueprint, request, jsonify
from openai import OpenAI
from openai.types.chat import ChatCompletion
from app.utils import token_required
from dotenv import load_dotenv
from ..models import db, Chatbot, FaceImage

load_dotenv()
bp = Blueprint('chat_routes', __name__, url_prefix='/api/chat')

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

@bp.route('/', methods=['POST'])
@token_required
def chat():
    try:
        data = request.json
        user_message = data.get('message')

        # OpenAI Chat Completion 요청
        response: ChatCompletion = client.chat.completions.create(
            # GPT 모델 이름 지정
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": user_message,
                }
            ]
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

        latest_faceimage = FaceImage.query.filter_by(user_id=user_id).order_by(FaceImage.uploaded_at.desc()).first()

        faceimage_id = latest_faceimage.id if latest_faceimage else None

        new_chatbot = Chatbot(
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