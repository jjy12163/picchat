from flask import Blueprint, jsonify, request, current_app
from ..models import User, FaceImage, db
from ..utils import token_required

bp = Blueprint('user_routes', __name__, url_prefix='/api/user')

@bp.route('/', methods=['GET'])
@token_required
def get_user():
    try:
        current_user = request.current_user
        user = User.query.filter_by(email=current_user['email']).first()
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

@bp.route('/update_nickname', methods=['PUT'])
@token_required
def update_nickname(): 
    try: 
        current_user = request.current_user
        user = User.query.filter_by(email = current_user['email']).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        new_nickname = request.json.get('nickname')
        current_app.logger.info(f"새 닉네임: {new_nickname}")
        if new_nickname: 
            user.nickname = new_nickname
            db.session.commit()
            return jsonify(''),200
        else:
            return jsonify({'error': '닉네임을 입력해주세요'}), 400
    except Exception as e:
        current_app.logger.error(f"닉네임 변경시 오류: {e}")
        return jsonify({'error': '닉네임 변경 중 오류 발생'}), 500

@bp.route('/delete_account', methods=['DELETE'])
@token_required
def delete_account(): 
    try:
        current_user = request.current_user
        user = User.query.filter_by(email = current_user['email']).first()
        if user:            
            FaceImage.query.filter_by(user_id=user.id).delete()
            
            db.session.delete(user)
            db.session.commit()
            response = jsonify({'message': '회원 탈퇴 성공'})
            response.set_cookie('token', '', expires=0)
            return response,200
        else: 
            return jsonify({'error': '사용자 찾을 수 없음'}),404
    except Exception as e:
        current_app.logger.error(f"회원 탈퇴 오류: {e}")
        return jsonify({'error': f'회원 탈퇴 중 오류 발생: {str(e)}'}), 500