from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from ..models import FaceImage, db
from io import BytesIO
import numpy as np
import cv2
from deepface import DeepFace
from ..utils import token_required

bp = Blueprint('face_image_routes', __name__, url_prefix='/api/face_image')

@bp.route('/upload_and_analyze', methods=['POST'])
@token_required
def upload_and_analyze():
    current_user = request.current_user
    if 'image' not in request.files:
        current_app.logger.error('No file part in the request')
        return jsonify({'error': 'No file part'}), 400

    file = request.files['image']
    if file.filename == '':
        current_app.logger.error('No selected file')
        return jsonify({'error': 'No selected file'}), 400

    try: 
        filename = secure_filename(file.filename)
        image_data = file.read()
        face_image = FaceImage(
            image = image_data,
            filename = filename,
            user_id = current_user['sub']
        )
        db.session.add(face_image)
        db.session.commit()
    
        # 이미지 업로드 성공 후 DeepFace로 감정 분석 진행 
        image_file = BytesIO(image_data)
        img_array = np.frombuffer(image_file.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            current_app.logger.error("OpenCV failed to decode the image.")
            return jsonify({'error': 'Failed to decode image'}), 500
        
        results = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
        emotions = results[0]['emotion']
        return jsonify({'emotions': emotions})

    except Exception as e:
        current_app.logger.error(f"Exception: {str(e)}")
        return jsonify({'error': str(e)}), 500
