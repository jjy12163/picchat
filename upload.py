from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pic_analysis import analyze_image

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({'message': 'File successfully uploaded', 'file_path': file_path})

@app.route('/analyze', methods=['POST'])
def analyze_uploaded_image():
    data = request.get_json()
    if not data or 'image_path' not in data:
        return jsonify({'error': 'No image path provided'}), 400
    
    image_path = data.get('image_path')
    
    try:
        results = analyze_image(image_path)
        return jsonify({'results': results})
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(port=3001)
