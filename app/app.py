from flask import Flask, request
from flask_cors import CORS
import os
import joblib


BASE_URL = '/api/v1'

app = Flask("Fraudulentos API")

CORS(app)


@app.route(BASE_URL + '/get_models', methods=['GET'])
def get_models():
    
    model_files = [model for model in os.listdir('../models') if model.endswith('.pkl')]
    model_names = [os.path.splitext(model)[0] for model in model_files]
    
    return {'models': model_names}, 200


@app.route(BASE_URL + '/add_data', methods=['POST'])
def add_data():

    pass


@app.route(BASE_URL + '/run_model', methods=['POST'])
def run_model():
    
    try:
        data = request.get_json()
        model_name = data.get('model_name')

        if not model_name:
            return {'error': 'Model name is required'}, 400

        model_path = f'../models/{model_name}.pkl'
        
        if not os.path.exists(model_path):
            return {'error': 'Model not found'}, 404

        model = joblib.load(model_path)
        y = model.predict("dataset")
        
        return {
                'model_name': model_name,
                'profit': 1,  
                'accuracy': 0.1,  
                'precision': 0.1,
                'recall': 0.1,
                'f1_score': 0.1,
                'y': y.tolist()
        }, 200

    except Exception as e:
        return {'error': str(e)}, 500
    

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)