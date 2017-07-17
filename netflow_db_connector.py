import requests
import os
import sys
import MySQLdb
import json
import datetime
import ast
import csv
import os.path

csv_file = "www/already_added.csv"
json_file = "www/data.json"

url = "privacyproxy.io"
port = 3306

conn = MySQLdb.connect(host=url, port=port, user='haojian', passwd='cmuchimps', db='netflow')

cur = conn.cursor()
cur.execute("SELECT * FROM netflow_data")

# create file if it doesn't exist 
if not os.path.isfile(csv_file):
    with open(csv_file, 'wb') as f:
        f.close()

#extract id list
id_list = []
with open(csv_file, 'rb') as f:
    reader = csv.reader(f)
    for row in reader:
        id_list.append(row[0])
f.close()

row_list = []

if os.path.isfile(json_file):
    with open(json_file, 'rb') as f:
        data = json.load(f)
        for row in data:
            row_list.append(row)
    f.close()


def generate_row_id(row):
    return '_' + str(hash(row))

for row in cur:
    id = generate_row_id(row[0]+str(row[1])+row[2]+row[3]+row[4])
    if (id not in id_list):
        cur_dict = {}
        cur_data = {}
        cur_dict['app'] = row[0]
        cur_dict['version'] = row[1]
        cur_dict['host'] = row[2]
        cur_dict['path'] = row[3]
        new_str = "{"+row[4]+"}"
        try:
            cur_data = ast.literal_eval(new_str)
        except:
            cur_data = {}
        cur_dict['data'] = cur_data
        cur_dict['creation_time'] = row[5].__str__()
        row_list.append(cur_dict)
        id_list.append(row[0])
        with open(csv_file, 'a') as f:
            writer = csv.writer(f)
            writer.writerow([id, row[0]])
        f.close()
    else:
        print("Row already added.")


def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()


with open(json_file, 'wb') as outfile:
    json.dump(row_list, outfile, default = myconverter)


cur.close()
conn.close()

