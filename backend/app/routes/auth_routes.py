from flask import Blueprint, redirect, request, session, url_for, jsonify, current_app
from oauthlib.oauth2 import WebApplicationClient
import requests, os, json
from ..models import db, User

bp = Blueprint('auth_routes', __name__, url_prefix='/api/auth')

client = WebApplicationClient(os.getenv('GOOGLE_CLIENT_ID'))

# HTTPS 무시
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

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

        session['user'] = {
            'email': user.email,
            'username': user.username,
            'profile_image': user.profile_image,
        }

        return redirect('/main')

    except Exception as e:
        current_app.logger.error(f"google_callback() 오류: {str(e)}")
        return jsonify({'error': '인증 실패'}), 500
