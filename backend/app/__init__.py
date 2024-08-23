from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

import os
import boto3

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__, static_folder="build")
    app.config.from_object(os.getenv('FLASK_CONFIG') or 'config.Config')
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

    # DB 설정
    db.init_app(app)
    migrate.init_app(app, db)

    # S3 클라이언트 설정 (예시)
    s3 = boto3.client(
        "s3",
        aws_access_key_id=app.config["S3_ACCESS_KEY"],
        aws_secret_access_key=app.config["S3_SECRET_KEY"],
        region_name=app.config["S3_REGION"]
    )


    with app.app_context():
        from .routes import register_blueprints
        register_blueprints(app)

    # 프론트엔드 설정
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app