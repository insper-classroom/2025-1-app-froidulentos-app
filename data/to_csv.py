import pandas as pd

arquivos = [("payers-v1.feather", "payers-v1.csv"),
            ("seller_terminals-v1.feather", "seller_terminals-v1.csv"),
            ("transactions_train-v1.feather", "transactions_train-v1.csv")]

for feather_path, csv_path in arquivos:
    df = pd.read_feather(feather_path)
    df.to_csv(csv_path, index=False)

