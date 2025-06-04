from flask import Flask, request
from flask_cors import CORS
import os
import joblib
import pandas as pd
from utils.preprocess import preprocess
from utils.add_dvc import add_to_dvc, save_data
from utils.run_model import run_model

BASE_URL = '/api/v1/freudulentos'

app = Flask("Fraudulentos API")

CORS(app)


@app.route(BASE_URL + '/models', methods=['GET'])
def get_models():
    try:
        model_files = [
            model for model in os.listdir('models') if model.endswith('.pkl')
        ]
        model_names = [model.split('.')[0] for model in model_files]

        return {'models': model_names}, 200
    except Exception as e:
        return {"error": f"Failed to retrieve models: {str(e)}"}, 500


@app.route(BASE_URL + "/predict", methods=['POST'])
def predict():

    model_name = request.form.get('model_name')
    if not model_name:
        return {"error": "Model name is required"}, 400

    try:
        model = joblib.load('models/' + model_name + '.pkl')
    except Exception as e:
        return {"error": f"Failed to load model: {str(e)}"}, 500

    if "payers" not in request.files or \
       "terminals" not in request.files or \
       "transactions" not in request.files:

        return {
            "error":
            f"Missing required data fields: payers, terminals, transactions"
        }, 400

    payers = pd.read_feather(request.files.get('payers'))
    terminals = pd.read_feather(request.files.get('terminals'))
    transactions = pd.read_feather(request.files.get('transactions'))

    try:
        X = preprocess(new_payers=payers,
                       new_terminals=terminals,
                       new_transactions=transactions)
    except Exception as e:
        return {"error": f"Data preprocessing failed: {str(e)}"}, 500

    try:
        predictions, probas = run_model(model, X)

        model_path = save_data(transactions, predictions, probas, model_name)
        add_to_dvc(model_path)

    except Exception as e:
        return {"error": f"Model prediction failed: {str(e)}"}, 500

    return "Predictions saved successfully", 200


@app.route(BASE_URL + '/model_predictions', methods=['GET'])
def model_predictions():

    model_files = [
        model for model in os.listdir('data/predictions')
        if model.endswith('.feather')
    ]
    model_names = [model.split('.')[0] for model in model_files]

    return {'model_predictions': model_names}, 200


@app.route(BASE_URL + '/model_predictions/<model_name>', methods=['GET'])
def get_model_prediction(model_name):
    try:
        predictions = pd.read_feather(f'data/predictions/{model_name}.feather')
        if predictions.empty:
            return {
                "error": "No predictions found for the specified model"
            }, 404

        page = request.args.get('page', 1, type=int)
        page_size = request.args.get('page_size', 100, type=int)
        print(predictions.attrs)

        start = (page - 1) * page_size
        end = start + page_size

        paginated_predictions = predictions.iloc[start:end]
        return {
            "model_name": predictions.attrs.get('model_name', model_name),
            "created_at": predictions.attrs.get('created_at', 'Unknown'),
            "total_predictions": len(predictions),
            "tx_id": paginated_predictions['tx_id'].tolist(),
            "predictions": paginated_predictions['pred'].tolist(),
            "probabilities": paginated_predictions['proba'].tolist()
        }, 200

    except Exception as e:
        return {
            "error": f"Failed to retrieve model predictions: {str(e)}"
        }, 500


@app.route(BASE_URL + "/evaluate", methods=['POST'])
def evaluate():
    # TODO
    return 0

    if not 'model_predictions' in request.files:
        return {"error": "Model predictions file is required"}, 400

    model_predictions = request.files.get('model_predictions')

    if 'y_true' not in request.files:
        return {
            "error": "True labels (y_true) are required for evaluation"
        }, 400

    y_true = request.files.get('y_true')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
