// Lista de compras

const list_space = document.querySelector('.itens')
const preco_total = document.querySelector('#preco_total')
const box_space = document.querySelector('.basic_layout')
const list_container = document.querySelector('.list_container')


lista_atual = [
    {
        'name': 'Leite',
        'price': 5
    },
    {
        'name': 'Peixe',
        'price': 10
    }
]

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
                <div class="itens">
                    <p>Nome: Leite, Preço: R$ 5.00</p>
                    <p>Nome: Peixe, Preço: R$ 10.00</p>
                    <!-- Mais itens podem ser adicionados aqui -->
                </div>

                <!-- Rodapé -->
                <div class="footer">
                    <p class="preco">Preço Total: R$ 15.00</p>
                    <form action="/add_list" method="post" class="form-container">
                        <input type="text" name="item_name" placeholder="Nome do Produto">
                        <input type="number" name="item_price" placeholder="Preço">
                        <button class="btn btn-primary">Adicionar</button>
                    </form >
                    <div class="buttons">
                        <button class="btn btn-success">Confirmar</button>
                        <button class="btn btn-danger">Cancelar</button>
                    </div>
                </div>
    </div>
`
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
    console.log(lista_atual)
    gerarLista()
}

// Envia informações para o servidor
function enviar_Lista_Atual() {

    // Pega a lista atual
    let insert_list = {
        user_id: "exemplo_user_id",  // Este ID será substituído pelo backend
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
    .then(data => console.log(data))
    .catch(error => console.error('Erro: erro no envio da lista_atual', error));
}


// resposta do servidor sobre o login se for bem-sucedido => renderiza a web-page se nao => mostra o erro
$("form").on("submit", function(event) {
    // Previne o comportamento padrão de envio do formulário que faz com que o site recarregue a pagina de login
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário

    $.ajax({
        type: "POST",
        url: "/Just_login",
        data: {
            action: "login",
            username: $("#username").val(),
            password: $("#password").val()
        },
        success: function(response) {
            if (response.success) {
                // Update the page content here
                render_history_space();
            } else {
                // Handle login failure
                alert("Login failed: " + response.message);
                console.log(response.message);
            }
        }
    });
})

function render_history_space() {
    console.log('IS working!!!');

    list_container.innerHTML = ` `

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
                    <form action="/create_list" method="post" class="form-container">
                        <input type="text" name="list_name" placeholder="Nome da lista">
                        <button  class="btn btn-primary history_list_button">Criar Lista</button>
                    </form >
                </div>
    </div>
    `
}

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