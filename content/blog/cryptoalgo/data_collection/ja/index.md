---
title: python-binanceを使って分足をpostgresqlに保存する
date: "2021-05-08T23:46:37.121Z"
---

![BTC](../btc.jpeg)

本記事では、PythonでAlgorithmic Tradingを行うためのデータを集める部分の実装を紹介します。

# 前提 
以下のライブラリを使います。
事前に以下のライブラリをinstallしてください。
- python-binance
- psycopg2

また任意の環境でpostgresqlを用意してください。

# 要件
以下の要件で
- binance futuresのUSDT建てのsymbolの1分足のデータを取得する。
- closeされたklineだけをデータベースにinsertする。
- 時刻のデータはunixtimeからdatetimeへ変換する。


# 実装

## ライブラリのimport 

```python
import time
import datetime
import sys


from binance import ThreadedWebsocketManager
from binance.client import Client
import psycopg2 
from psycopg2.extensions import AsIs

```

## 変数の定義
以下の3つの変数を定義します。
```python
database_url = "database URL"
api_key = "binance api key"
api_secret = "binance api key"
```

## テーブルの作成
databaseにtableを作成します。
```sql
create table binancef_1min (
kline_start_time timestamp,  
line_close_time timestamp, 
symbol text, 
interval text, 
first_trade_id int, 
last_trade_id int, 
open float, 
close float, 
high float, 
low float, 
base_asset_volume float, 
number_of_trades float, 
is_this_kline_closed boolean, 
quote_asset_volume float, 
taker_by_base_asset_volume float, 
taker_by_quote_asset_volume float, 
ignore int, 
primary key(kline_start_time, symbol));
```

## データ取得

```python
old_keys = ["t", "T", "s", "i", "f", "L", "o", "c", "h", "l", "v", "n", "x", "q", "V", "Q", "B"]
new_keys = ["kline_start_time", "kline_close_time", "symbol", "interval", "first_trade_id", "last_trade_id", "open", "close", "high", "low", "base_asset_volume", "number_of_trades", "is_this_kline_closed", "quote_asset_volume", "taker_by_base_asset_volume", "taker_by_quote_asset_volume", "ignore"]

def change_dict_key(d, old_key, new_key, default_value=None):
     d[new_key] = d.pop(old_key, default_value)

twm = ThreadedWebsocketManager(api_key=api_key, api_secret=api_secret)
# start is required to initialise its internal loop
twm.start()

def handle_socket_message(msg):
    if msg["k"]["x"] == True:
    
        tmp = msg['k']
        for i, key in enumerate(old_keys):
            change_dict_key(tmp,old_key= key , new_key = new_keys[i], default_value=None)
        tmp["kline_start_time"] = datetime.datetime.utcfromtimestamp(tmp["kline_start_time"]/ 1000).strftime('%Y-%m-%dT%H:%M:%S')
        tmp["kline_close_time"] = datetime.datetime.utcfromtimestamp(tmp["kline_close_time"]/ 1000).strftime('%Y-%m-%dT%H:%M:%S')

        columns = tmp.keys()
        values = [tmp[column] for column in columns]

        insert_statement = 'insert into binancef_1min (%s) values %s'

        with psycopg2.connect(database_url) as conn:
            with conn.cursor() as cur:
                cur.execute(insert_statement, (AsIs(','.join(columns)), tuple(values)))
    else:
        pass
        # do nothing

for sym in USDT_symbols['symbol']:
    twm.start_kline_socket(callback=handle_socket_message, symbol=sym, interval=Client.KLINE_INTERVAL_1MINUTE)
```

## データ取得終了

```python
twm.stop()
```

# TODO
以上のコードをローカルで実行すれば、データベースにデータが貯まりはじめます。
次はこのアプリケーションをGCEにデプロイします。（がpsycopg2を使っているところの変更が必要になります。）