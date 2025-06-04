

def run_model(model, X):

    for col in ["is_fraud", "is_transactional_fraud", "tx_fraud_report_date"]:
        if col not in X.columns:
            print(f"Column {col} not found in X, setting to 0")
            X[col] = 0

    X_final = X.drop(
        columns=[
            "tx_date",
            "tx_datetime",
            "transaction_id",
            "tx_time",
            "card_id",
            "terminal_id",
            "is_transactional_fraud",
            "is_fraud",
            "tx_fraud_report_date",
            "card_hash",
            "card_bin",
            "card_first_transaction",
            "terminal_operation_start",
            "terminal_soft_descriptor",
            "latitude",
            "longitude",
            "tx_hour",
            "week_day",
            "tx_month",
            "card_MII",
            "card_bank",
            "tx_month_cos",
            "tx_month_sin",
            "card_past_transactional_frauds",
            "card_past_non_transactional_frauds",
            "terminal_past_transactional_frauds",
            "terminal_non_transactional_frauds",
            "card_terminal_non_transactional_frauds",
        ]
    )

    # non tx fraud
    y_final = X["is_fraud"] - X["is_transactional_fraud"]

    print("Running model...")
    return model.predict(X_final), model.predict_proba(X_final)[:, 1].tolist()