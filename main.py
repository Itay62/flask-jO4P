import os
from flask import Flask, abort
import mysql.connector as mysql
# from settings import dbpwd
import json
from flask_socketio import SocketIO
from flask_cors import CORS


# db = mysql.connect(
# host = "127.0.0.1",
# user = "root",
# passwd = dbpwd,
# database = "moveo")

# db = mysql.connect(
#     host="containers-us-west-83.railway.app",
#     user="root",
#     passwd="MbWhhASn1kFtyKrjYSlS",
#     database="railway")


db = mysql.connect(
    host=os.environ['DB_HOST'],
    user=os.environ['DB_USER'],
    passwd=os.environ['DB_PASSWORD'],
    database=os.environ['DB_NAME']
)

# For build:
app = Flask(__name__,
            static_folder='./build',
            static_url_path='/')


@ app.route('/')
def index():
    return app.send_static_file('index.html')


# app = Flask(__name__)

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


@ app.route('/codelinks', methods=['GET'])
def get_links():
    query = "SELECT id, title from codeblocks"
    cursor = db.cursor()
    cursor.execute(query)
    records = cursor.fetchall()
    if not records:
        abort(401)
    cursor.close()
    headers = ['id', 'title']
    data = []
    for r in records:
        data.append(dict(zip(headers, r)))
    return json.dumps(data)


@ app.route('/codeblock/<int:id>', methods=['GET'])
def get_code(id):
    query = "SELECT id, title, code, code_solution FROM codeblocks WHERE id = %s"
    values = (id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    if not record:
        abort(401)
    cursor.close()
    headers = ['id', 'title', 'code', 'code_solution']
    return json.dumps(dict(zip(headers, record)))


@ socketio.on('connect')
def handle_connect():
    print("client connected")


@ socketio.on('code_change')
def handle_code_change(data):
    print("change io")
    id = data['id']
    newCode = data['code']
    query = "UPDATE codeblocks SET code = %s WHERE id = %s"
    values = (newCode, id)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    socketio.emit('code_updated', data)


# if __name__ == "__main__":
#     socketio.run(app)


if __name__ == '__main__':
    socketio.run(app)
