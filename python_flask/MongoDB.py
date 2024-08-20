from flask import jsonify, session, redirect, url_for
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
import datetime



uri = "mongodb+srv://williansouza11922:Herika40@cluster0.ajgv5lu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

db = client['sample_mflix']
users_collection = db['Market_users']
shopping_history_collection = db['market_history']


def connect_to_mongo():
    # Selecionar o banco de dados
    db = client['sample_mflix']

    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return "You successfully connected to MongoDB!"
    except Exception as e:
        print(e)
        return "Failed to connect to MongoDB"

def insert_list(insert_list):

    collection = db['Market_List']
    
    collection.insert_many(insert_list)

# Login e registro de usuário

def register_user(username, password):
    # Lógica de registro
    db = client['sample_mflix']
    collection = db['Market_users']

    collection.insert_one({'username': username, 'password': password})
    return "Usário registrado com sucesso"

def login_user(username, password):
    # Lógica de login
    user = users_collection.find_one({"username": username, "password": password})

    session['user_id'] = str(user['_id'])
    return jsonify({"message": "Login bem-sucedido"})
