from datetime import datetime
from flask import Flask, request
from flask_cors import CORS
import os
import joblib
import pandas as pd
from utils.preprocess import preprocess
from utils.add_dvc import add_to_dvc, save_data
from utils.run_model import run_model
from utils.evaluate import evaluate_model
import subprocess

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

        model_path = save_data(transactions, predictions, probas, model_name, request.files['transactions'].filename)
        add_to_dvc(model_path)

    except Exception as e:
        return {"error": f"Model prediction failed: {str(e)}"}, 500

    return "Predictions saved successfully", 200


@app.route(BASE_URL + '/model_predictions', methods=['GET'])
def model_predictions():
    
    pull = subprocess.Popen('dvc pull', shell=True)
    pull.wait()
    model_files = [
        model for model in os.listdir('data/predictions')
        if model.endswith('.feather')
    ]
    model_names = [model.split('.')[0] for model in model_files]

    # sort model names by datetime in ascending order
    model_names.sort(key=lambda x: datetime.strptime(x.split('_')[-2] + '_' + x.split('_')[-1], '%Y-%m-%d_%H-%M-%S'), reverse=True)

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
        page_size = request.args.get('page_size', 10, type=int)

        start = (page - 1) * page_size
        end = start + page_size

        paginated_predictions = predictions.iloc[start:end]
        return {
        "model_name": model_name,
        "total_predictions": len(predictions),
        "tx_id": paginated_predictions['tx_id'].tolist(),
        "predictions": paginated_predictions['pred'].tolist(),
        "probabilities": paginated_predictions['proba'].tolist(),
        "evaluation": evaluate_model(predictions),
        "test_df_name": paginated_predictions['test_df_name'].tolist()[0]
    }, 200

    except Exception as e:
        return {
            "error": f"Failed to retrieve model predictions: {str(e)}"
        }, 500


@app.route(BASE_URL + '/add_model', methods=['POST'])
def add_model():
    if 'model' not in request.files:
        return {"error": "Model file is required"}, 400

    model_file = request.files['model']
    model_name = model_file.filename.split('.')[0]

    if not model_name:
        return {"error": "Model name cannot be empty"}, 400
    
    if not model_file.filename.endswith('.pkl'):
        return {"error": "Model file must be a .pkl file"}, 400

    try:
        model_path = f'models/{model_name}.pkl'
        model_file.save(model_path)
        subprocess.run(["dvc", "add", model_path], check=True)
        subprocess.run(["git", "add", model_path + ".dvc"], check=True)
        subprocess.run(["git", "commit", "-m", f"Add model {model_name}"], check=True)
        subprocess.run(["dvc", "push"], check=True)

        return {"message": f"Model '{model_name}' added successfully"}, 201
    except Exception as e:
        return {"error": f"Failed to add model: {str(e)}"}, 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
