from flask import Flask, request
from flask_cors import CORS
import os
import joblib
import pandas as pd
from utils.preprocess import preprocess


BASE_URL = '/api/v1/freudulentos'

app = Flask("Fraudulentos API")

CORS(app)


@app.route(BASE_URL + '/models', methods=['GET'])
def get_models():
    
    model_files = [model for model in os.listdir('../models') if model.endswith('.pkl')]
    model_names = [os.path.splitext(model)[0] for model in model_files]
    
    return {'models': model_names}, 200



@app.route(BASE_URL + "/predict", methods=['GET'])
def predict():

    model_name = request.args.get('model_name')

    model_path = os.path.join('./models', model_name + '.pkl') # Path to your models directory
    if not os.path.exists(model_path):
        app.logger.warning(f"Model file not found: {model_path}")
        return {"error": f"Model '{model_name}' not found at {model_path}"}, 404

    
    model = joblib.load(model_path) 

    
    if 'payers' not in request.files or \
       'terminals' not in request.files or \
       'transactions' not in request.files:
        app.logger.warning("Missing files.")
        return {"error": "Missing one or more Feather files. Required: 'payers', 'terminals', 'transactions'"}, 400

    payers = pd.read_feather(request.files['payers'])
    terminals = pd.read_feather(request.files['terminals'])
    transactions = pd.read_feather(request.files['transactions'])

    processed_df = preprocess(
            new_payers=payers,
            new_terminals=terminals,
            new_transactions=transactions
        )
    
    predictions = model.predict(processed_df)
    probas = model.predict_proba(processed_df)

    return {
        "model_name": model_name,
        "predictions": predictions.tolist(),
        "probabilities": probas.tolist()
    }, 200


@app.route(BASE_URL + "/evaluate", methods=['GET'])
def evaluate():
    pass


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)