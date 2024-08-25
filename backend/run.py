from app import create_app
from config import Config
from werkzeug.middleware.proxy_fix import ProxyFix  


app = create_app()
app.config.from_object(Config) 
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1, x_prefix=1)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
