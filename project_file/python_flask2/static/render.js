// Lista de compras

const preco_total = document.querySelector('#preco_total')
const box_space = document.querySelector('.basic_layout')
const list_container = document.querySelector('.list_container')

usuario_atual = ''
nome_nova_lista = ''
lista_atual = [
    
]


function alert_message(alert_Content) {
    alert(alert_Content); 
}

//  add the list creation interface
function render_list() {

    list_container.innerHTML = ` `

    list_container.innerHTML = `
    <div class="basic_layout">
                <!-- Cabeçalho -->
                <h3 class="header">Lista de Compras</h3>

                <!-- Lista de itens -->
                <div class="itens" id="itens">
                    <!-- Mais itens podem ser adicionados aqui -->
                </div>

                <!-- Rodapé -->
                <div class="footer">
                    <p class="preco" id="preco_total"></p>
                    <input type="text" name="item_name" placeholder="Nome do Produto">
                    <input type="number" name="item_price" placeholder="Preço">
                    <button class="btn btn-primary" onclick="adicionarItem(event)">Adicionar</button>
                    <div class="buttons">
                        <button class="btn btn-success" onclick="enviar_Lista_Atual(event)">Confirmar</button>
                        <button class="btn btn-danger" onclick="render_history_space()">Cancelar</button>
                    </div>
                </div>
    </div>
`
    
    gerarLista()
}

 function criarLista(event, list_name) {
    event.preventDefault()

    nome_nova_lista = list_name
    
    lista_atual = [
        
    ]
    render_list()
 }

function exit_actual_list() {
    box_space.innerHTML = ` `
    nome_nova_lista = ''
}


function calcularTotal() {
    let total = 0
    lista_atual.forEach(element => {
        total += parseFloat(element.price)
    });
    return total
}

// generate the actual list and update the full price
function gerarLista() {
    const list_space = document.querySelector('#itens')

    // clear the list space
    list_space.innerHTML = ``

    // add the items
    lista_atual.forEach(element => {
        list_space.innerHTML += `<p>Nome: ${element.name}, Preço: R$ ${element.price}</p> <button class="btn btn-danger" onclick="removeItem('${element.name}')">Remover</button>`
    });

    // update the full price
    preco_total.innerHTML = `Preço Total: R$ ${calcularTotal()}`
}

// add the item to the list
function adicionarItem(event) {
    // Evita que o site seja reiniciado toda vez que o button submit é clicado
    event.preventDefault();
    let name = document.querySelector('input[name="item_name"]').value
    let price = document.querySelector('input[name="item_price"]').value

    // Verifica se o preço foi preenchido
    if (!price) {
        alert('Preencha no minimo o campo preço')
        return
    }
    lista_atual.push({name, price})
    gerarLista()
}
// Remove the item in the list and update the list
function removeItem(item_name) {
    lista_atual = lista_atual.filter(item => item.name !== item_name)
    gerarLista()
}

// render_history_space() 
function remove_list(list_name) {
    fetch('http://127.0.0.1:5000/remove_list', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({list_name: list_name})
        }).then(response => response.json())
            .then(data => {
                mensagen = data;
                if (mensagen.response == true) {
                    render_history_space()
                }
    })
    .catch(error => console.error('Erro: erro no envio da lista_atual', error));
}

function open_list(list_name) {
    fetch('http://127.0.0.1:5000/open_list', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({list_name: list_name})
        }).then(response => response.json())
            .then(data => {
                mensagen = data;
                if (mensagen.response == true) {
                    render_list()
                }
    })
    .catch(error => console.error('Erro: erro no envio da lista_atual', error));
}

// send list to the server
function enviar_Lista_Atual() {

    // formato em que a lista vai ser enviada para o DB
    let insert_list = {
        list_name: nome_nova_lista,
        user_id: usuario_atual,  // Este ID será substituído pelo backend
        created_at: new Date().toISOString(),
        items: lista_atual,
        total_price: calcularTotal()
    };

    // Envia informações para o endereço que vai enviar para o DB
    fetch('http://127.0.0.1:5000/process_list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(insert_list)
    })
    .then(response => response.json())
    .then(data => {
        mensagen = data;
        alert_message(mensagen.message);
        
        // limpa a lista atual
        nome_nova_lista = ''
        lista_atual = [
            
        ]
        render_history_space()
    })
    .catch(error => console.error('Erro: erro no envio da lista_atual', error));
}

// the login is done here
function SendData(event, action) {
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário
  
    acao_desejada = action
    console.log("Action: " + acao_desejada);
  
    $.ajax({
      type: "POST",
      url: "/Just_login",
      contentType: "application/json", // Add this line
      data: JSON.stringify({ // Stringify the data object
        action: acao_desejada,
        value: $("#value").val(),
        username: $("#username").val(),
        password: $("#password").val()
      }),
      success: function(response) {
        if (response.success == true) {
          usuario_atual = response.message
          // Atualiza o conteúdo da página com o historico de listas do usuário
          render_history_space();
        } else {
          // mostra uma mensagem de erro para o usuário
          alert("Login failed: " + response.message);
          console.log(response.message);
        }
      }
    });
  }

// update user list in the list space
function atualizar_historico(listas_do_usuario) {
    const itens_space = document.querySelector('.itens');

    listas_do_usuario.forEach((element) => {
        itens_space.innerHTML += `<p>Nome: ${element.list_name}, Preço: R$ ${element.total_price}</p> <button class="btn btn-danger" onclick="remove_list('${element.list_name}')">Remover</button><button class="btn btn-success" onclick="open_list('${element.list_name}')">abrir</button>`
    })
}
// all the lists of the user saved
function render_history_space() {
    list_container.innerHTML = `
    <div class="basic_layout">
                <!-- Cabeçalho -->
                <h3 class="styled_title">Historico de Listas</h3>

                <!-- Todas as lista do usuario -->
                <div class="itens">
                    <!-- itens seram adicionados aqui -->
                </div>

                <!-- Rodapé -->
                <div class="footer history_footer">
                    <h4 class="styled_title">Criar Lista</h4>
                    <input type="text" name="list_name" id="list_name" placeholder="Nome da lista">
                    <button  class="btn btn-primary history_list_button" onclick="criarLista(event, document.getElementById('list_name').value)">Criar Lista</button>
                </div>
    </div>
    `

    // to store the user lists
    listas_do_usuario = ""

    // pick the user lists in the DB
    fetch('http://127.0.0.1:5000/user_history', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        listas_do_usuario = data;
        console.log(listas_do_usuario);
        // Atualiza o conteúdo da página com o historico de listas do usuário
        atualizar_historico(listas_do_usuario)
    })
    .catch(error => console.error('Erro: erro no envio da lista', error));
}