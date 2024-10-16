from flask import Flask, render_template, request, jsonify, session
from flask_socketio import SocketIO

from MongoDB import register_user, login_user, insert_list, get_user_history

app = Flask(__name__)


# Configura a chave secreta
app.secret_key = 'sua_chave_secreta'  # Necessária para sessões seguras
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')


# login e verifica se o usuário existe no DB
@app.route('/Just_login', methods=['POST'])
def handle_login_register():
    data = request.get_json()
    action = data['action']
    username = data['username']
    password = data['password']

    # limpa os dados de sessão
    session['user_id'] = ""
    session['authentication'] = ""

    if username is None or password is None:
        return jsonify(success=False, message="Por favor, preencha todos os campos!")
    else:
        if action == 'login':
            Server_response = login_user(username, password)
            if Server_response == True:
                print("Login efetuado com sucesso!")
                # Retorne uma resposta de sucesso
                # e adiciona no session os dados do usuário
                session['user_id'] = username
                session['authentication'] = True
                return jsonify(success=True, message=session['user_id'])
            else:
                return jsonify(success=False, message="Usuário ou senha inválidos!")
            
        elif action == 'register':
            resposta_regristo = register_user(username, password)
            if resposta_regristo == False:
                return jsonify(success=False, message="O nome de usuário ja existe!")
            else:
                return jsonify(success=True, message="Usuario criado com sucesso!")

@app.route('/process_list', methods=['POST'])
def process_list():
    print("Processando lista de compras is on !!!!!!!!!!!!!!!!!!!!!")
    data = request.json
    status = insert_list(data)


    if status == True:
        return jsonify({"message": "Lista de compras salva com sucesso!"})
    return jsonify({"message": "Erro ao salvar a lista de compras"})

# historico de listas cridas pelo usuario do usuario
@app.route('/user_history', methods=['GET'])
def shopping_history():
    if 'user_id' not in session:
        return jsonify({"message": "Usuário não autenticado"}), 401
    
    user_id = session['user_id']
    
    # Buscando o usuário pelo ID
    user_data = get_user_history(user_id)
    
    # Verificando se o usuário existe e se há listas associadas
    if not user_data or 'lista' not in user_data:
        return jsonify({"message": "Nenhuma lista encontrada"}), 404
    
    history_list = []
    
    # Iterando sobre cada lista do usuário
    for lista in user_data['lista']:
        history_list.append({
            "list_name": lista['list_name'],
            "created_at": lista['created_at'],
            "items": lista['items'],
            "total_price": lista['total_price']
        })
    
    return jsonify(history_list)

if __name__ == '__main__':
    app.run(debug=True)