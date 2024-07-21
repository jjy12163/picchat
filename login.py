from flask import Flask, redirect, request, session, url_for, jsonify, send_from_directory
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
import pymysql.cursors
import traceback

# Flask 애플리케이션 생성
app = Flask(__name__, static_folder='../build')
app.secret_key = 'your-secret-key'

# CORS 설정
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# MySQL 연결 설정
db_connection = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='root',
    database='picchat',
    port=3306,
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

# OAuth 설정 (Google OAuth 2.0)
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id='609109706210-q0or4v7eetq17hupp64gf2lf7d969pfp.apps.googleusercontent.com',  # Google Developer Console에서 발급받은 클라이언트 ID
    client_secret='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',  # Google Developer Console에서 발급받은 클라이언트 Secret
    authorize_url='https://accounts.google.com/o/oauth2/v2/auth',
    authorize_params=None,
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri='http://localhost:3000/auth/google/callback',
    client_kwargs={'scope': 'openid profile email'}
)

# Google 로그인 및 사용자 관리
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/auth/google')
def google_login():
    redirect_uri = url_for('google_callback', _external=True)
    return google.authorize_redirect(redirect_uri='http://localhost:3000/auth/google/callback')

@app.route('/auth/google/callback')
def google_callback():
    # 클라이언트에게 코드 받음 -> 엑세스 토큰 교환
    code = request.args.get('code')
    if not code:
        return "No code provided", 400
    
    try:
        token = google.authorize_access_token()

        if not token:
            raise Exception("Authorization failed.")
        
        resp = google.get('userinfo')
        profile = resp.json()
        user_email = profile['email']
        user_picture = profile('picture', '')

        # 사용자 조회
        with db_connection.cursor() as cursor:
             sql = "SELECT * FROM user WHERE email = %s"
             cursor.execute(sql, (user_email,))
             user = cursor.fetchone()

            # 새로운 사용자 등록
             if not user:
                sql_insert = "INSERT INTO user (userName, password, email, nickname, picture) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(sql_insert, (profile['name'], 'defaultpassword', user_email, profile['name'], user_picture))
                db_connection.commit()
                cursor.execute(sql, (user_email,))
                user = cursor.fetchone()

             session['user_id'] = user['idUser']
             return redirect('/home')  # 홈으로 이동

    except pymysql.MySQLError as e:
        print(f"MySQL error: {e}")
        traceback.print_exc()
        return "Database error", 500
    
    except Exception as e:
        print(f"Error accessing user: {e}")
        traceback.print_exc()
        return "Error accessing user", 500

@app.route('/profile', method=['GET'])
def profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT * FROM user WHERE idUser = %s"
            cursor.execute(sql, (user_id,))
            user = cursor.fetchone()

            if user:
                return jsonify(user)
            else:
                return jsonify({'error': 'User not found'}), 404
            
    except Exception as e:
        print(f"Error accessing user: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Error accessing user'}), 500
    
@app.route('/profile/update_nickname', methods=['POST'])
def update_nickname():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    new_nickname = data.get('nickname')
    
    try:
        with db_connection.cursor() as cursor:
            sql = "UPDATE user SET nickname = %s WHERE idUser = %s"
            cursor.execute(sql, (new_nickname, user_id))
            db_connection.commit()
            return jsonify({'success': True})
    except Exception as e:
        print(f"Error updating user: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Error updating user'}), 500

@app.route('/profile/update_picture', methods=['POST'])
def update_picture():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    new_picture = data.get('picture')
    
    try:
        with db_connection.cursor() as cursor:
            sql = "UPDATE user SET picture = %s WHERE idUser = %s"
            cursor.execute(sql, (new_picture, user_id))
            db_connection.commit()
            return jsonify({'success': True})
    
    except Exception as e:
        print(f"Error updating user: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Error updating user'}), 500
    

@app.route('/logout', method=['POST'])
def logout():
    session.pop('user_id', None)
    return redirect('/')


@app.route('/delete_account', methods=['DELETE'])
def delete_account():
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Unauthorized"}, 401

    try:
        with db_connection.cursor() as cursor:
            sql = "DELETE FROM user WHERE idUser = %s"
            cursor.execute(sql, (user_id,))
            db_connection.commit()
            session.pop('user_id', None)
            return {"message": "Account deleted successfully"}, 200

    except Exception as e:
        print(f"Error deleting user: {e}")
        traceback.print_exc()
        return {"error": "Server error"}, 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)
