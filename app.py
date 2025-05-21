from flask import Flask, request
from flask_cors import CORS
import os

BASE_URL = '/api/v1'

app = Flask("ML Model API")
CORS(app)

#-------------------------------- ROUTES --------------------------------

#--------------------------------- PREDICT ---------------------------------

@app.route(BASE_URL + '/predict', methods=['POST'])
def prediction():
    """
    Predict the target variable using the trained model.

    Input must be a JSON object with the same structure as the training data.
    """
    # print(request.json)
    pred = predict(MODEL, request.json)
    if pred is None:
        return {'error': 'Invalid input data'}, 400
    return {'predicted_value' : float(pred)}, 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)