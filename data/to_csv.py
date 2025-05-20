import pandas as pd
import os

FOLDER = "./data/"
for file in os.listdir(FOLDER):
    if file.endswith(".feather"):
        df = pd.read_feather(FOLDER + file)
        csv_file = FOLDER + file.replace(".feather", ".csv")
        df.to_csv(csv_file, index=False)

