from flask import Blueprint, redirect, request, url_for, jsonify, current_app, make_response
from oauthlib.oauth2 import WebApplicationClient
import requests, os, json, jwt
from datetime import datetime, timedelta, timezone
from ..models import db, User
from ..utils import token_required

bp = Blueprint('auth_routes', __name__, url_prefix='/api/auth')

client = WebApplicationClient(os.getenv('GOOGLE_CLIENT_ID'))

@bp.route('/google')
def google_login():
    google_provider_cfg = requests.get(os.getenv('GOOGLE_DISCOVERY_URL')).json()
    authorization_endpoint = google_provider_cfg['authorization_endpoint']

    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for('auth_routes.google_callback', _external=True),
        scope=['openid', 'email', 'profile'],
    )
    return redirect(request_uri)

@bp.route('/google/callback')
def google_callback():
    try:
        code = request.args.get('code')
        google_provider_cfg = requests.get(os.getenv('GOOGLE_DISCOVERY_URL')).json()
        token_endpoint = google_provider_cfg['token_endpoint']

        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=request.url,
            redirect_url=request.base_url,
            code=code
        )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(os.getenv('GOOGLE_CLIENT_ID'), os.getenv('GOOGLE_CLIENT_SECRET')),
        )
        token_response.raise_for_status()
        client.parse_request_body_response(json.dumps(token_response.json()))

        userinfo_endpoint = google_provider_cfg['userinfo_endpoint']
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)
        
        userinfo_response.raise_for_status()
        userinfo = userinfo_response.json()
        user = User.query.filter_by(email=userinfo['email']).first()

        # 사용자 정보 DB에 저장
        if user is None:
            user = User(
                username=userinfo['name'],
                email=userinfo['email'],
                profile_image=userinfo.get('picture'),
                nickname=userinfo['name']
            )
            db.session.add(user)
            db.session.commit()

        # JWT 토큰 생성 
        token = jwt.encode({
            'sub': user.id,
            'name': user.username,
            'email': user.email,
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        response = make_response(redirect('/main'))
        response.set_cookie('token', token, httponly=True, secure=True, samesite='Strict')
        return response

    except Exception as e:
        current_app.logger.error(f"google_callback() 오류: {str(e)}")
        
        return jsonify({'error': '인증 실패'}), 500

@bp.route('/logout', methods=['POST'])
@token_required
def logout():
    response = make_response(jsonify({'message': '로그아웃 성공'}), 200) 
    response.set_cookie('token', '', expires=0)
    return response
