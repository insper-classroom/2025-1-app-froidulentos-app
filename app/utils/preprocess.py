'''
fazendo o script de preprocessamento para que a gente consiga automatizar essa bagaça!!!
vamos pra frente e tudo nosso!
'''
import os
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
import argparse
import numpy as np # Added numpy import
from datetime import datetime
import reverse_geocoder as rg
import numpy as np
from feature_engine.creation import CyclicalFeatures
import subprocess

SEED = 42  # resposta do universo tiw


def extract_data(path: str) -> pd.DataFrame:
    pull = subprocess.Popen('dvc pull', shell=True)
    pull.wait()

    df = pd.read_feather(path)
    return df


'''
fução para leitura de dados de forma automatizado e devolucao do pd.read_feather em uma tupla!
'''
def read_data(data_dir, subset):
    ''' 
    esse subset faz com que alterne entre treino (train - no caso) e validação (val), querem isso na rúbrica caducos!
    essa var trans_files são os.... files.... que o arquivo de transações vai carregar com base no que explique acima
    '''
    trans_file = ("transactions_train-v1.feather"
                  if subset == "train" else "transactions_val-v1.feather")


    '''
    payers são os dados dos PORTADORES
    terminals são... os terminais das vendas...
    transactions dados das transações do SUBSET SELECIONADO E ATUALIZADO 2025
    '''
    data_dir_path = Path(data_dir)
    payers = pd.read_feather(data_dir_path / 'payers-v1.feather')
    terminals = pd.read_feather(data_dir_path / "seller_terminals-v1.feather")
    transactions = pd.read_feather(data_dir_path / trans_file)

    return payers, terminals, transactions


'''
uma função para concatenar as datasets em um só para termos todas as features!
o left_on="card_id" no df de transactions e o right_on="card_hash" representam o mesmissimo cartão poxa!
usa o how="left" para que fique todas as transacoes mas que nao tenha um payer correspondente
(para analisarmos anomalias mais tarde vai ser top)
'''
def concat_df(payers, terminals, transactions):
    df = transactions.merge(payers, left_on="card_id", right_on="card_hash", how="left")

    '''
    aqui dnv estamos usando o how="left" que deixa todas as transacoes mesmo se um termianl nao existir (NaN)
    retorna o df com todos juntos, bem legal e bacana para treinar o model
    '''
    df = df.merge(terminals, on="terminal_id", how="left")
    return df

def convert_to_datetime(df, column_name, format_str="%Y-%m-%d %H:%M:%S", inplace=True):
    '''
    converte a coluna de data/hora para datetime do pandas, se der erro ele vai deixar como NaT
    '''
    target_df = df if inplace else df.copy()
    try:
        target_df[column_name] = pd.to_datetime(df[column_name], format=format_str)
    except (ValueError, TypeError) as e:
        target_df[column_name] = pd.to_datetime(df[column_name], errors='coerce')
        print(f'Error : {e}. Was not able to convert with format_str, using general parser instead. Check for NaT values.')

    if not inplace:
        return target_df
    
def get_city_from_coordinates(df: pd.DataFrame) -> pd.DataFrame:

    coordinates = list(zip(df['latitude'], df['longitude']))
    results = rg.search(coordinates)
    df['city'] = [result['name'] for result in results]
    return df

def process_soft_descriptor(df: pd.DataFrame) -> pd.DataFrame:
    '''
    split the soft_descriptor, since the last part is always a number (pegadinha) we take it off the string and keep the rest
    '''

    df['terminal_soft_descriptor'] = df['terminal_soft_descriptor'].apply(lambda x: ' '.join(x.split(' ')[:-1]))
    only_frauds = df[df['is_fraud'] == True]
    total = only_frauds['terminal_soft_descriptor'].value_counts().sum()
    best_descriptors = (only_frauds['terminal_soft_descriptor'].value_counts() / total) * 100

    best_descriptors = best_descriptors.sort_values(ascending=False).cumsum()

    top_30 = best_descriptors[best_descriptors <= 30]
    
    # if descriptor in the top 30, true, else false
    df['danger_descriptor'] = df['terminal_soft_descriptor'].isin(top_30.index)

    return df

def process_card_bin(df: pd.DataFrame) -> pd.DataFrame:
    '''
    get MII and the rest of the card bin
    '''

    df['card_MII'] = df['card_bin'].astype(str).str[0]
    df['card_bank'] = df['card_bin'].astype(str).str[1:]

    # -------
    
    only_frauds = df[df['is_fraud'] == True]
    total = only_frauds['card_MII'].value_counts().sum()
    best_MIIs = (only_frauds['card_MII'].value_counts() / total) * 100

    best_MIIs = best_MIIs.sort_values(ascending=False).cumsum()

    top_30 = best_MIIs[best_MIIs <= 30]
    
    df['danger_MII'] = df['card_MII'].isin(top_30.index)

    # -------

    only_frauds = df[df['is_fraud'] == True]
    total = only_frauds['card_bank'].value_counts().sum()
    best_banks = (only_frauds['card_bank'].value_counts() / total) * 100

    best_banks = best_banks.sort_values(ascending=False).cumsum()

    top_30 = best_banks[best_banks <= 30]

    df['danger_bank'] = df['card_bank'].isin(top_30.index)

    return df

def convert_dates(df):
    '''
    converte o data/hora da transacao (tx_datatime) para um objeto realemnte no datetime do pandas, só para ajudar a gente com comparação, pegar hora/dia/mes mais tarde (campo de horario sem data) em datetime mas só extrai só os componentes .time para vermos fraudes em horarios meio SUS para fraudes como as madrugas
    no tx_date converte para formatore ideal para analises e que nao fica com doenca
    '''
    convert_to_datetime(df, "tx_datetime", "%Y-%m-%d %H:%M:%S", inplace=True)
    convert_to_datetime(df, "card_first_transaction", "%Y-%m-%d", inplace=True)
    convert_to_datetime(df, "terminal_operation_start", "%Y-%m-%d", inplace=True)

    return df

def funcoes_basicas(df):

    
    df.index.name = 'index'
    df['card_days_active'] = ((df["tx_datetime"]) - (df["card_first_transaction"])).dt.days
    df["terminal_days_active"] = ((df["tx_datetime"]) - (df["terminal_operation_start"])).dt.days
    df['tx_hour'] = df["tx_datetime"].dt.hour
    df["week_day"] = df["tx_datetime"].dt.weekday
    df['tx_month'] = df["tx_datetime"].dt.month

    # transformando colunas de tempo em ciclicas 
    cyclical_features = CyclicalFeatures(variables=['tx_hour', 'week_day', 'tx_month'],
                                            drop_original=True)
    df = cyclical_features.fit_transform(df)

    return df


def add_count_features(df: pd.DataFrame) -> pd.DataFrame:
    counts = df.reset_index().set_index('tx_datetime')
    counts.sort_index(inplace=True)
    def count_transactions(counts, col_name:str) -> pd.DataFrame:
        for time in ['1h', '24h', '7d', '30d']:
            counts[f'{col_name}_count_{time}'] = counts.rolling(window=time)['card_id'].count() - 1
        counts.reset_index(inplace=True)
        counts.set_index("index", inplace=True)
        return counts

    card_df = counts.groupby('card_id', group_keys=False).apply(count_transactions, col_name='card')
    terminal_df = counts.groupby('terminal_id', group_keys=False).apply(count_transactions, col_name='terminal')

    df = pd.merge(card_df, terminal_df, on=list(set(card_df).intersection(set(terminal_df))), how="left")

    df["card_total_tx"] = df.sort_values([
                                                    "card_id", "transaction_id"
                                                    ]).groupby("card_id", sort=False)["card_id"] \
                                                    .cumcount()
    df["terminal_total_tx"] = df.sort_values([
                                                    "terminal_id", "transaction_id"
                                                    ]).groupby("terminal_id", sort=False)["terminal_id"] \
                                                    .cumcount()
    
    df = df.sort_values('tx_datetime').reset_index(drop=True)
    return df




def past_frauds(df: pd.DataFrame):

    df["card_past_transactional_frauds"] = df.sort_values([
                                                "card_id", "tx_datetime"
                                            ]).groupby("card_id", sort=False)["is_transactional_fraud"] \
                                            .cumsum()
    
    df["card_past_non_transactional_frauds"] = df.sort_values([
                                                    "card_id", "tx_datetime"
                                                ]).groupby("card_id", sort=False)["is_fraud"] \
                                                .cumsum() - df["card_past_transactional_frauds"]
    
    df["terminal_past_transactional_frauds"] = df.sort_values([
                                                    "terminal_id", "tx_datetime"
                                                ]).groupby("terminal_id", sort=False)["is_transactional_fraud"] \
                                                .cumsum()
    
    df["terminal_non_transactional_frauds"] = df.sort_values([
                                                    "terminal_id", "tx_datetime"
                                                ]).groupby("terminal_id", sort=False)["is_fraud"] \
                                                .cumsum() - df["terminal_past_transactional_frauds"]
                                                
    df["card_terminal_non_transactional_frauds"] = df.sort_values([
                                                    "terminal_id", "card_id", "tx_datetime"
                                                    ]).groupby( ["terminal_id", "card_id"], sort=False)["is_fraud"] \
                                                    .cumsum()

    return df



'''
add de features que julguei ser interessante como tempo de uso do cartao, tempo de operacao no terminal, dia da semana e hora da transação
peguei as ideias do luigi para esse cara parar de falar que cago para as ideias dele vai ter o dia da semana de 0 a 6 assim como ele fez e o horario da transacao
'''


def add_features(df):
    df = funcoes_basicas(df)
    df = add_count_features(df)
    df = past_frauds(df)
    df = get_city_from_coordinates(df)
    df = process_soft_descriptor(df)
    df = process_card_bin(df)
    return df




'''
adicionando uma função para tirar duplicatas!!! interessante não???
funcao do luigi que nao alterei para ele nao me encher o saco!
'''
def duplicata(df):
    num_duplicates_before = df.duplicated().sum()
    if num_duplicates_before > 0:
        print(f"Number of duplicates before removal: {num_duplicates_before}")
        df = df.drop_duplicates(keep='first')
        print(f"Number of duplicates after removal: {df.duplicated().sum()}")
    else:
        print("Number of duplicates: 0")
    return df


'''
funcao para reduzir o peso do dataset, com menos Mb o modelo deve rodar melhor e mais rapido
'''
def reduce_memory_usage(df):
    print("Original memory usage:")
    print(df.info(memory_usage='deep'))

    # Downcast float64 to float32
    float64_cols = df.select_dtypes(include='float64').columns
    for col in float64_cols:
        df[col] = df[col].astype('float32')
        print(f"Column {col} converted to float32")

    # Downcast int64 based on min/max
    int64_cols = df.select_dtypes(include='int64').columns
    for col in int64_cols:
        min_val = df[col].min()
        max_val = df[col].max()
        print(f"\nColumn: {col}, Min: {min_val}, Max: {max_val}")
        if min_val >= np.iinfo(np.int8).min and max_val <= np.iinfo(np.int8).max:
            df[col] = df[col].astype('int8')
            print(f"Column {col} converted to int8")
        elif min_val >= np.iinfo(np.int16).min and max_val <= np.iinfo(np.int16).max:
            df[col] = df[col].astype('int16')
            print(f"Column {col} converted to int16")
        elif min_val >= np.iinfo(np.int32).min and max_val <= np.iinfo(np.int32).max:
            df[col] = df[col].astype('int32')
            print(f"Column {col} converted to int32")
        else:
            print(f"Column {col} kept as int64") # Or handle unsigned if applicable

    # Downcast int32 based on min/max
    int32_cols = df.select_dtypes(include='int32').columns
    for col in int32_cols:
        min_val = df[col].min()
        max_val = df[col].max()
        print(f"\nColumn: {col}, Min: {min_val}, Max: {max_val}")
        if min_val >= np.iinfo(np.int8).min and max_val <= np.iinfo(np.int8).max:
            df[col] = df[col].astype('int8')
            print(f"Column {col} converted to int8")
        elif min_val >= np.iinfo(np.int16).min and max_val <= np.iinfo(np.int16).max:
            df[col] = df[col].astype('int16')
            print(f"Column {col} converted to int16")
        else:
            print(f"Column {col} kept as int32")

    print("\nMemory usage after downcasting:")
    print(df.info(memory_usage='deep'))
    return df



'''
Função para salvar os datasets processados.
Se o subset original for 'train', ele também divide em treino/validação para modelagem.
'''
def save_data(df, out_dir, original_subset_name, seed_value):
    output_path = Path(out_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    current_date = datetime.now().strftime("%Y_%m_%d")
    processed_file_path = os.path.join(output_path, f"{original_subset_name}_processed_{current_date}.feather")
    # Reset index before saving to feather, standard practice.
    df_to_save = df.reset_index()
    df_to_save.to_feather(processed_file_path)
    print(f"Saved fully processed data for subset '{original_subset_name}' to {processed_file_path}")


def relevant_df(df, past_df):
    new_past_df = past_df[ \
        past_df["card_id"].isin(df["card_id"]) \
        | past_df["terminal_id"].isin(df["terminal_id"]) \
    ]
    full_df = pd.concat([new_past_df, df], ignore_index=True)
    return full_df


def clean_df(df, original_df):
    return original_df[original_df["transaction_id"].isin(df["transaction_id"])]


'''
FINALMENTE O NOSSO PREPROCESSAMENTE, uma pipe que junta todas as funcoes para comecarmos a fazer o nosso feature engineering e salvar de vez,
mas a rúbrica pede um préprocessamento automatico entao vamos ter que salvar duas vezes.... um prepro e um df_completao!
'''
def preprocess(new_payers=None, new_terminals=None, new_transactions=None, subset="test"):

    print(f"Starting preprocessing for subset: '{subset}'")

    print(f"Reading data from")

    payers = extract_data("../data/payers-v1.feather.dvc")
    terminals = extract_data("../data/seller_terminals-v1.feather.dvc")
    transactions = extract_data(f"../data/transactions_train-v1.feather.dvc")

    print("Concatenating dataframes...")

    past_df = concat_df(payers, terminals, transactions)

    df = concat_df(new_payers, new_terminals, new_transactions)
    
    rel_df = relevant_df(df, past_df)

    print("Converting date columns...")

    rel_df = convert_dates(rel_df)

    print("Adding features...")

    rel_df = add_features(rel_df)

    print("Removing duplicates...")

    rel_df = duplicata(rel_df)

    print("Cleaning df")

    clean_df = clean_df(df, rel_df)

    print(f"Preprocessing for subset '{subset}' done.")

    return clean_df



