### File Descriptions:

* **`app.py`**:
    * This is the main entry point for the Flask API.
    * It defines API endpoints for:
        * Fetching available model names (`GET /api/v1/freudulentos/models`).
        * Making predictions on new transaction data (`GET /api/v1/freudulentos/predict`).
    * It loads a pre-trained model (e.g., `.pkl` file) and uses the `preprocess` module to prepare incoming data before prediction.

* **`utils/preprocess.py`**:
    * This crucial script contains all the logic for transforming raw transaction, payer, and terminal data into a format suitable for machine learning models.
    * **Key functionalities include:**
        * **Data Loading & Concatenation:** Reading data from various sources (Feather files, potentially DVC-tracked files) and merging them.
        * **Date Conversions:** Converting date/time string columns to datetime objects.
        * **Feature Engineering:**
            * Creating time-based features (e.g., `card_days_active`, `terminal_days_active`, `tx_hour`, `week_day`, `tx_month`).
            * Generating cyclical features from time-based attributes.
            * Calculating historical transaction counts for cards and terminals over various time windows (1h, 24h, 7d, 30d).
            * Aggregating past fraud occurrences for cards and terminals.
            * Extracting city information from latitude/longitude using `reverse_geocoder`.
            * Processing `terminal_soft_descriptor` to identify potentially risky descriptors.
            * Analyzing `card_bin` to extract MII (Major Industry Identifier) and bank identifiers, and flagging potentially risky ones.
        * **Duplicate Removal:** Identifying and removing duplicate transaction entries.
        * **Memory Optimization:** Downcasting data types to reduce memory footprint.
    * The `preprocess` function is the main interface used by `app.py`.

* **`adding_data.ipynb`**:
    * This Jupyter Notebook is used for initial data preparation, specifically splitting the main dataset (`tx_all-v1.feather`) into training, validation, and testing sets.
    * It saves these subsets as Feather files (e.g., `tx_train-v1.feather`, `tx_val-v1.feather`, `tx_test-v1.feather`).
    * It also creates a combined training and validation set (`tx_train_val-v1.feather`).

## Key Functionalities

1.  **Data Preprocessing**: Handled by `utils/preprocess.py`. It takes raw data for payers, terminals, and new transactions, along with historical transaction data, to engineer features.
2.  **API Endpoints**: Provided by `app.py`:
    * `GET /api/v1/freudulentos/models`: Lists available machine learning models.
    * `GET /api/v1/freudulentos/predict`: Accepts transaction data (payers, terminals, transactions) and a model name, then returns fraud predictions and probabilities.
3.  **Data Splitting**: The `adding_data.ipynb` notebook is responsible for creating the necessary data splits for model training and evaluation.


## Getting Started

1.  **Environment**: 
    * Run `python -m venv venv` to create.
    * Run `source venv/Scripts/activate` to activate.

2.  **Dependencies**: 
    * Run `pip install -r requirements.txt`.

3.  **Running the API**:
    * Navigate to the directory containing `app.py`.
    * Run the Flask app using a command like: `python app.py`
    * The API will then be accessible at `http://0.0.0.0:8080`.

4.  **Models**: The API expects pre-trained models (e.g., `.pkl` files) to be present in a `../models/` directory relative to `app.py` (or `models/` relative to where `app.py` is run, check pathing in `app.py`).

5.  **Data**:
    * `DVC` is used to versionate data. Follow the steps below to set it up!
        * Run `aws configure`, ask for the correct ID and KEY to have acess to our DVC.
        * Run `dvc pull` to get the current dataframes.

## Workflow Overview

1.  **Data Preparation**:

    * Raw data is split into training, validation, and test sets using `adding_data.ipynb`.

2.  **Model Training**:
    * The models available are being trained with data from 01-01 to 04-30 (mm-dd, tx_train_val-v1.feather).
    * The trained models are saved at `app/models`.

3.  **Prediction**:
    * A client sends a GET request to `/api/v1/freudulentos/predict` with new transaction data (payers, terminals, transactions) in feather format and the desired model name.
    * The API uses `utils/preprocess.py` to process this new data, incorporating historical context.
    * The processed data is fed to the loaded model.
    * The API returns the predictions and probabilities.

## Notes for New Trainees

* **DVC**: DVC is actively used, so make sure it is setup correctly! 
    * Sometimes the imports dont work that well with dvc, make sure `aws awscli dvc dvc[s3]` are installed.

    * Familiarize yourself with its commands (`dvc pull`, `dvc add`, `dvc push`) for data management.