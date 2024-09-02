from flask import Blueprint, request, jsonify, current_app, redirect
from werkzeug.utils import secure_filename
from ..models import FaceImage, db
from io import BytesIO
import numpy as np
import cv2, uuid, boto3, os
from deepface import DeepFace
from ..utils import token_required

# S3 설정
s3 = boto3.client(
    's3',
    region_name=os.getenv('S3_REGION')
)

bp = Blueprint('face_image_routes', __name__, url_prefix='/api/face_image')

def upload_to_s3(file_data, filename):
    try:
        # 고유한 파일명 생성 (확장자 유지) 
        ext = os.path.splitext(filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        
        s3.upload_fileobj(
            Fileobj=BytesIO(file_data),
            Bucket=os.getenv('S3_BUCKET_NAME'),
            Key=unique_filename,
        )

        # S3 URL 생성
        image_url = f"https://{os.getenv('S3_BUCKET_NAME')}.s3.{os.getenv('S3_REGION')}.amazonaws.com/{unique_filename}"

        return unique_filename, image_url

    except Exception as e:
        current_app.logger.error(f"S3 업로드 오류: {e}")
        return None, None


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
        unique_filename, image_url = upload_to_s3(image_data, filename)
        if not unique_filename:
            return jsonify({'error': '이미지 업로드 실패'}), 500
        
        # 이미지 정보 RDS에 저장
        face_image = FaceImage(
            filename=unique_filename,
            user_id=current_user['sub'],
            image_url=image_url
        )

        db.session.add(face_image)
        db.session.commit()
    
        # 이미지 업로드 성공 후 DeepFace로 감정 분석 진행 
        img_array = np.frombuffer(image_data, np.uint8)
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

        # S3 url로 리디렉션 
        return redirect(face_image.image_url)

    except Exception as e:
        current_app.logger.error(f"Exception: {str(e)}")
        return jsonify({'error': str(e)}), 500
