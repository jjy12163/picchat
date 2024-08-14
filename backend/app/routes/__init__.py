from .user_routes import bp as user_bp
from .face_image_routes import bp as face_image_bp
from .auth_routes import bp as auth_bp
from .chat_routes import bp as chat_bp


def register_blueprints(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(face_image_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)
