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


 function criarLista(event, list_name) {
    event.preventDefault()

    nome_nova_lista = list_name
    
    lista_atual = [
        
    ]
    render_list()
 }

function exit_actual_list() {
    box_space.innerHTML = ` `
}

function render_list() {

    list_container.innerHTML = ` `

    list_container.innerHTML = `
    <div class="basic_layout">
                <!-- Cabeçalho -->
                <h3 class="header">Lista de Compras</h3>

                <!-- Lista de itens -->
                <div class="itens" id="itens">
                    <p>Nome: Leite, Preço: R$ 5.00</p>
                    <p>Nome: Peixe, Preço: R$ 10.00</p>
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


function calcularTotal() {
    let total = 0
    lista_atual.forEach(element => {
        total += parseFloat(element.price)
    });
    return total
}

// gera a lista e atualiza o preço total
function gerarLista() {
    const list_space = document.querySelector('#itens')

    // Limpa o espaço de itens
    list_space.innerHTML = ` `

    // Adiciona os itens
    lista_atual.forEach(element => {
        list_space.innerHTML += `<p>Nome: ${element.name}, Preço: R$ ${element.price}</p>`
    });

    // Atualiza o preço total
    preco_total.innerHTML = `Preço Total: R$ ${calcularTotal()}`
    
}

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

// Envia a nova lista para o servidor
function enviar_Lista_Atual() {

    // formato em que a lista vai ser enviada para o DB
    let insert_list = {
        list_name: nome_nova_lista,
        user_id: usuario_atual,  // Este ID será substituído pelo backend
        created_at: new Date().toISOString(),
        items: lista_atual,
        total_price: calcularTotal()
    };
    console.log(insert_list)

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
        render_list()
        
    })
    .catch(error => console.error('Erro: erro no envio da lista_atual', error));
}


function SendData(event, action) {
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário
    console.log("Sending data to server");
  
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


function render_history_space() {

    fetch('http://127.0.0.1:5000/user_history', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        lists = data;
        console.log(lists);
    })
    .catch(error => console.error('Erro: erro no envio da lista', error));
    console.log(lists);

    list_container.innerHTML = `
    <div class="basic_layout">
                <!-- Cabeçalho -->
                <h3 class="styled_title">Historico de Listas</h3>

                <!-- Todas as lista do usuario -->
                <div class="itens">
                    <p>Nome: Leite, Preço: R$ 5.00</p>
                    <p>Nome: Peixe, Preço: R$ 10.00</p>
                    <!-- Mais itens podem ser adicionados aqui -->
                </div>

                <!-- Rodapé -->
                <div class="footer history_footer">
                    <h4 class="styled_title">Criar Lista</h4>
                    <input type="text" name="list_name" id="list_name" placeholder="Nome da lista">
                    <button  class="btn btn-primary history_list_button" onclick="criarLista(event, document.getElementById('list_name').value)">Criar Lista</button>
                </div>
    </div>
    `
    // forEach(lists, (list) => {
    //     list_container.innerHTML += `<p>Nome: ${list.name}</p>`
    // })
}

// function render_history_list() {

//     // pega as listas do servidor
//     $.ajax({
//         type: "GET",
//         url: "/user_history",
//         data: {
//             action: "Grab_users_lists",
//             username: $("#username").val(),
//             password: $("#password").val()
//         },
//         success: function(response) {
//             if (response.success) {
//                 console.log(response.message);
//                 // Update the page content here
//                 render_history_space();
//             } else {
//                 // Handle login failure
//                 alert("Login failed: " + response.message);
//                 console.log(response.message);

// const socket = io();

// socket.on('render_history_space', function() {
//     console.log('Received render_history_space event!');
//     render_history_space();
// });



// div class="basic_layout">    
//             <!-- Cabeçalho -->
//         <h3 class="header">Lista de Compras</h3>

//         <!-- Lista de itens -->
//         <div class="itens">
//             <!-- os itens vão ser renderizados aqui pelo render.js -->
//         </div>

//         <!-- Rodapé -->
//         <div class="footer">
//             <p class="preco" id="preco_total"></p>
//             <form action="" class="form-container">
//                 <input type="text" name="item_name" placeholder="Nome do Produto">
//                 <input type="number" name="item_price" placeholder="Preço">
//                 <button class="btn btn-primary" onclick="adicionarItem(event)">Adicionar</button>
//             </form >
//             <div class="buttons">
//                 <button class="btn btn-success" onclick="enviar_Lista_Atual(event)">Confirmar</button>
//                 <button class="btn btn-danger" onclick="exit_actual_list(event)">Cancelar</button>
//             </div>
//         </div>
//     </div>

