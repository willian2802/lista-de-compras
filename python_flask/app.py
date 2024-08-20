from flask import Flask, render_template, request,jsonify, session, redirect, url_for

from pymongo import MongoClient
from bson.objectid import ObjectId
from pymongo.server_api import ServerApi

from MongoDB import register_user, login_user


app = Flask(__name__)


# Configura a chave secreta
app.secret_key = 'sua_chave_secreta'  # Necessária para sessões seguras

# Conecta ao MongoDB
uri = "mongodb+srv://williansouza11922:Herika40@cluster0.ajgv5lu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

db = client['sample_mflix']
users_collection = db['Market_users']
shopping_history_collection = db['market_history']


# login e verifica se o usuário existe no DB
@app.route('/Just_login', methods=['POST'])
def handle_login_register():
    action = request.form.get('action')
    username = request.form.get('username')
    password = request.form.get('password')

    # verifica se os campos foram preenchidos
    if username is None or password is None:
        return 'Por favor, preencha todos os campos!'
    else:

        if action == 'login':
            return login_user(username, password)  # Função Python para login
        elif action == 'register':
            return register_user(username, password)  # Função Python para registro
        else:
            return redirect(url_for('index'))  # Redireciona para a página inicial ou outra página

@app.route('/')
def index():
    return render_template('index.html')


# aqui que a lista vai ser enviada para o mongoDB
@app.route('/process_list', methods=['POST'])
def process_list():
    data = request.json
    user_id = data['user_id']  # No código real, substitua pelo ID do usuário logado na sessão
    created_at = data['created_at']
    items = data['items']
    total_price = data['total_price']
    
    # Inserir a lista de compras no banco de dados
    shopping_history_collection.insert_one({
        "user_id": ObjectId(user_id),
        "created_at": created_at,
        "items": items,
        "total_price": total_price
    })
    
    return jsonify({"message": "Lista de compras salva com sucesso!"})

# historico de compras do usuario
@app.route('/shopping_history', methods=['GET'])
def shopping_history():
    if 'user_id' not in session:
        return jsonify({"message": "Usuário não autenticado"}), 401
    
    user_id = ObjectId(session['user_id'])
    history = shopping_history_collection.find({"user_id": user_id})
    
    history_list = []
    for record in history:
        history_list.append({
            "created_at": record['created_at'],
            "items": record['items'],
            "total_price": record['total_price']
        })
    
    return jsonify(history_list)


if __name__ == '__main__':
    app.run(debug=True)