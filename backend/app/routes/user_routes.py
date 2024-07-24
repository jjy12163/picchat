from flask import Blueprint, jsonify, current_app
from ..models import User

bp = Blueprint('user_routes', __name__, url_prefix='/api/user')

@bp.route('/', methods=['GET'])
def get_user():
    try:
        user = User.query.get(4)  
        if user:
            return jsonify({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'nickname': user.nickname
            })
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        current_app.logger.error(f"Error retrieving user: {e}")
        return jsonify({'error': 'An error occurred while retrieving the user'}), 500
