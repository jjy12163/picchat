from flask import Blueprint, jsonify, current_app, session
from ..models import User

bp = Blueprint('user_routes', __name__, url_prefix='/api/user')

@bp.route('/', methods=['GET'])
def get_user():
    try:
        # 세션에서 이메일 정보 가져옴
        user_email = session.get('user', {}).get('email')
        if not user_email:
            return jsonify({'error': 'User not logged in'}), 401

        # 가져온 이메일로 사용자 조회
        user = User.query.filter_by(email=user_email).first()
        if user:
            return jsonify({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'nickname': user.nickname,
                'profile_image': user.profile_image
            })
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        current_app.logger.error(f"사용자 조회 오류: {e}")
        return jsonify({'error': '사용자 조회 중 오류 발생'}), 500

