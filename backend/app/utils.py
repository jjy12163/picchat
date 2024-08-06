from functools import wraps
from flask import request, jsonify, current_app
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return jsonify({'message': '토큰 없음'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            request.current_user = data
        except jwt.ExpiredSignatureError:
            return jsonify({'message': '토큰 만료'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': '유효하지 않은 토큰'}), 401

        return f(*args, **kwargs)
    return decorated
