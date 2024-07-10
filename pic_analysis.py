from deepface import DeepFace
import cv2

def analyze_image(image_path):
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Error: Unable to read the image.")

    # 감정 분석 수행
    results = DeepFace.analyze(img, actions=['emotion'])

    # 분석 결과 반환
    return results


if __name__ == '__main__':
    file_path = input("Enter the path of the image file: ")
    try:
        results = analyze_image(file_path)
        print(results)  # JSON 형식으로 출력
    except ValueError as e:
        print(str(e))
    # pass
