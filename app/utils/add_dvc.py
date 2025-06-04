import subprocess, os
from datetime import datetime
from pathlib import Path
import pandas as pd

def add_to_dvc(filename):
    # join folder_path with filepath
    filepath = os.path.join('data/predictions', filename)
    subprocess.run(["dvc", "add", filepath], check=True)

    # --- Step 3: Git Add the .dvc file (not the data itself) ---
    dvc_file = filepath + ".dvc"
    subprocess.run(["git", "add", dvc_file], check=True)
    subprocess.run(["git", "commit", "-m", f"Add processed data {filepath}"], check=True)

    # --- Step 4: Push to remote S3 via DVC ---
    subprocess.run(["dvc", "push"], check=True)


def save_data(transactions, y_pred, y_proba, model_name):


    date = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    processed_file_path = "data/predictions/" + f"{model_name}_pred_proba_{date}.feather"

    df = pd.DataFrame()
    df.attrs['model_name'] = model_name
    df.attrs['created_at'] = date
    df["tx_id"] = transactions["transaction_id"]
    df["pred"] = y_pred
    df["proba"] = y_proba
    df.to_feather(processed_file_path)

    print(f"Saved predictions for model '{model_name}' to {processed_file_path}")
    return f"{model_name}_pred_proba_{date}.feather"