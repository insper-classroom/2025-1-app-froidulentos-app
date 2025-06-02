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

    model = joblib.load('models/model.pkl') 
    
    payers = request.args.get('payers')
    terminals = request.args.get('terminals')
    transactions = request.args.get('transactions')

    processed_df = preprocess(
            new_payers=payers,
            new_terminals=terminals,
            new_transactions=transactions
        )
    
    predictions = model.predict(processed_df)
    probas = model.predict_proba(processed_df)

    return {
        "model_name": 'model',
        "predictions": predictions.tolist(),
        "probabilities": probas.tolist()
    }, 200

@app.route(BASE_URL + "/evaluate", methods=['GET'])
def evaluate():
    pass


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)