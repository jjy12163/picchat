from flask import Blueprint, request, jsonify, current_app, send_file
from werkzeug.utils import secure_filename
from ..models import FaceImage, db
from io import BytesIO
import numpy as np
import cv2
from deepface import DeepFace
from ..utils import token_required


# 추가 
import boto3
import os

# S3 설정
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('S3_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('S3_SECRET_KEY'),
    region_name=os.getenv('S3_REGION')
)


bp = Blueprint('face_image_routes', __name__, url_prefix='/api/face_image')

def upload_to_s3(file_data, filename):
    try:
        s3.upload_fileobj(
            BytesIO(file_data),
            os.getenv('S3_BUCKET_NAME'),
            filename,
            ExtraArgs={"ACL": "public-read", "ContentType": "image/jpeg"}
        )
        return f"https://{os.getenv('S3_BUCKET_NAME')}.s3.amazonaws.com/{filename}"
    except Exception as e:
        current_app.logger.error(f"S3 업로드 오류: {e}")
        return None


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

        # 이미지 S3에 업로드
        image_url = upload_to_s3(image_data, filename)
        if not image_url:
            return jsonify({'error': '이미지 업로드 실패'}), 500
        
        # 이미지 정보 RDS에 저장
        face_image = FaceImage(
            image=image_data,  # 또는 image=None, URL만 저장할 경우
            filename=filename,
            user_id=current_user['sub']
        )


        db.session.add(face_image)
        db.session.commit()
    
        # 이미지 업로드 성공 후 DeepFace로 감정 분석 진행 
        img_array = np.frombuffer(image_data.read(), np.uint8)
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

@bp.route('/download/<int:image_id>', methods=['GET'])
@token_required
def download_image(image_id):
    try:
        # 이미지 검색
        face_image = FaceImage.query.filter_by(id=image_id, user_id=request.current_user['sub']).first()

        if not face_image:
            return jsonify({'error': '이미지 없음'}), 404

        # 이미지 클라이언트로 전송
        s3_object = s3.get_object(Bucket=os.getenv('S3_BUCKET_NAME'), Key=face_image.filename)
        return send_file(
            BytesIO(s3_object['Body'].read()),
            mimetype='image/jpeg',
            as_attachment=True,
            download_name=face_image.filename
        )
    except Exception as e:
        current_app.logger.error(f"Exception: {str(e)}")
        return jsonify({'error': str(e)}), 500