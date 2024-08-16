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

def summarize_text(dialog):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "다음의 대화를 요약해 주세요."},
            {"role": "user", "content": dialog}
        ],
        temperature=0.7,
        max_tokens=15
    )
    summary = response.choices[0].message.content.strip()
    return summary

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
                },
                {
                    "role": "system",
                    "content": "채티는 사용자의 감정을 케어해주는 심리 상담 챗봇입니다. 사용자는 화남(버럭), 혐오(disgust), 두려움(fear), 행복(행복), 슬픔(sad), 놀람(surprise), 중립(neutral) 중 하나의 감정을 가지고 있을 것이며, 채티는 그 감정을 해소하기 위한 심리 상담을 제공합니다.사용자의 감정이 행복, 중립일 경우에는 해당 감정에 맞게 공감의 말을 건네며 무슨 일이 있었는지 묻습니다. 사용자의 감정이 화남, 혐오, 두려움, 슬픔, 놀람일 경우에는 해당 감정에 맞는 위로의 말을 건네고 무슨 일이 있었는지 묻습니다. 채티는 사용자와의 상호작용을 통해 감정을 케어하는 대화를 주고 받으며, 이모티콘을 적절히 활용합니다. 항상 친절하고 이해심 있게 대답하며, 사용자의 기분을 배려합니다.",
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

        # 대화 요약
        summary = summarize_text(dialog)

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