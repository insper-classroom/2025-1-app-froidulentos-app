from flask import Flask, request
from flask_cors import CORS
import os
import joblib


BASE_URL = '/api/v1'

app = Flask("Fraudulentos API")
CORS(app)

@app.route(BASE_URL + '/add_data', methods=['POST'])
def add_data():

    data = request.json
    if not data:
        return {'error': 'No data provided'}, 400

    # Save the new data to a file or database
    # For simplicity, we will just print it here
    print("New data received:", data)
    
    # Here you would typically append this data to your training dataset
    return {'message': 'Data added successfully'}, 200



@app.route(BASE_URL + '/predict', methods=['POST'])
def prediction():
    pass
    
    

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)