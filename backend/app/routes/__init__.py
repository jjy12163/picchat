from .user_routes import bp as user_bp
from .face_image_routes import bp as face_image_bp

def register_blueprints(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(face_image_bp)
