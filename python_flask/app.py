from flask import Flask, render_template, request

from MongoDB import insert_list

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/process_list', methods=['POST'])
def process_list():
    # pega a lista enviada
    lista_enviada = request.get_json()

    # insere a lista no MongoDB
    insert_list(lista_enviada)
    return 'ok'
        

if __name__ == '__main__':
    app.run(debug=True)