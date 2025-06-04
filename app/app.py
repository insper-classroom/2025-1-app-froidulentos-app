from flask import Flask, request
from flask_cors import CORS
import os
import joblib
import pandas as pd
from utils.preprocess import preprocess
from utils.add_dvc import add_to_dvc, save_data


BASE_URL = '/api/v1/freudulentos'

app = Flask("Fraudulentos API")

CORS(app)


@app.route(BASE_URL + '/models', methods=['GET'])
def get_models():
    try:
        model_files = [model for model in os.listdir('models') if model.endswith('.pkl')]
        model_names = [model.split('.')[0] for model in model_files]
        
        return {'models': model_names}, 200
    except Exception as e:
        return {"error": f"Failed to retrieve models: {str(e)}"}, 500



@app.route(BASE_URL + "/predict", methods=['POST'])
def predict():

    data = request.get_json()
    
    model_name = data['model_name']
    if not model_name:
        return {"error": "Model name is required"}, 400
    
    try:
        model = joblib.load('models/' + model_name + '.pkl')     
    except Exception as e:
        return {"error": f"Failed to load model: {str(e)}"}, 500

    if "payers" not in data or \
       "terminals" not in data or \
       "transactions" not in data:
        
        return {"error": "Missing required data fields: payers, terminals, transactions"}, 400
    
    payers = pd.read_feather(data['payers'])
    terminals = pd.read_feather(data['terminals'])
    transactions = pd.read_feather(data['transactions'])

    try:
        processed_df = preprocess(
                new_payers=payers,
                new_terminals=terminals,
                new_transactions=transactions
            )
    except Exception as e:
        return {"error": f"Data preprocessing failed: {str(e)}"}, 500
    
    try:
        predictions = model.predict(processed_df)
        probas = model.predict_proba(processed_df)

        model_path = save_data(predictions, probas, model_name)
        add_to_dvc(model_path)
        
    except Exception as e:
        return {"error": f"Model prediction failed: {str(e)}"}, 500
    
    return {
        "model_name": model_name,
        "predictions": predictions.tolist(),
        "probabilities": probas.tolist()
    }, 200





@app.route(BASE_URL + '/get_predictions', methods=['GET'])
def get_predictions():
    
    model_files = [model for model in os.listdir('data/predictions') if model.endswith('.feather')]
    model_names = [model.split('.')[0] for model in model_files]
    
    return {'model_predictions': model_names}, 200




@app.route(BASE_URL + "/evaluate", methods=['POST'])
def evaluate():
    # TODO   
    return 0

    data = request.get_json()

    model_predictions = data.get('model_predictions')
    if not model_predictions:
        return {"error": "Model prediction is required"}, 400

    if 'y_true' not in data:
        return {"error": "True labels (y_true) are required for evaluation"}, 400
    
    y_true = data['y_true']



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)