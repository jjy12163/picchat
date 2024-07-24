from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from ..models import FaceImage, db

bp = Blueprint('face_image_routes', __name__, url_prefix='/api/face_image')

@bp.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        current_app.logger.error('No file part in the request')
        return jsonify({'error': 'No file part'}), 400

    file = request.files['image']
    if file.filename == '':
        current_app.logger.error('No selected file')
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        user_id = request.form['user_id']
        face_image = FaceImage(
            image=file.read(),
            filename=filename,
            user_id=user_id
        )
        db.session.add(face_image)
        db.session.commit()
        current_app.logger.info(f'Image uploaded successfully: {filename}')
        return jsonify({'message': 'Image uploaded successfully'}), 201

@bp.route('/<int:image_id>', methods=['GET'])
def get_image(image_id):
    image = FaceImage.query.get(image_id)
    if image:
        return jsonify({
            'id': image.id,
            'filename': image.filename,
            'uploaded_at': image.uploaded_at,
            'user_id': image.user_id
        })
    return jsonify({'error': 'Image not found'}), 404
