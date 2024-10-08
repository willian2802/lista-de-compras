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
shopping_history_collection = db['Market_List']


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

def insert_list(list_to_insert):

    list = list_to_insert

    # Cria um novo historico de usario se nao existir nenhum com o mesmo nome de usario
    if not shopping_history_collection.find_one({
        "user_name": list['user_id'],
    }):
        # Cria um novo historico de usario
        shopping_history_collection.insert_one({
            "user_name": list['user_id'],
        })
    
    # Atualiza o historico do usario com a nova lista
    shopping_history_collection.update_one({
                "user_name": list['user_id'],
            }, {
                "$push": {
                    "lista": {
                        "list_name": list['list_name'],
                        "created_at": list['created_at'],
                        "items": list['items'],
                        "total_price": list['total_price']
                    }
                }
            })

    return True


def create_user_history(list_to_insert):

    list = list_to_insert

    shopping_history_collection.insert_one({
        "user_name": list['user_id'],
        "lista": [
            
        ]
    })

# Login e registro de usuário

def register_user(username, password):
    db = client['sample_mflix']
    collection = db['Market_users']

    # verifica se o nome de usuário ja esta sendo usado no DB
    existing_user = collection.find_one({"username": username})
    if existing_user:
        return False

    collection.insert_one({'username': username, 'password': password})
    return True

def login_user(username, password):
    # Lógica de login
    user = users_collection.find_one({"username": username, "password": password})

    if user:
        session['user_id'] = str(user['_id'])
        return True
    else:
        return False

# Exemplo de recuperação de listas do usuário
def recuperar_listas(user_id):
    listas = db.listas.find({"user_id": ObjectId(user_id)})
    return list(listas)
