// Lista de compras

const list_space = document.querySelector('.itens')
const preco_total = document.querySelector('#preco_total')

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


function calcularTotal() {
    let total = 0
    lista_atual.forEach(element => {
      total += parseFloat(element.price)
    });
    return total
  }

// gera a lista e atualizada o preço total
function gerarLista() {

    // Limpa o espaço de itens
    list_space.innerHTML = ''

    // adiciona os itens
    lista_atual.forEach(element => {
    list_space.innerHTML += `<p>Nome: ${element.name}, Preço: R$ ${element.price}</p>`
    });

    // atualizada o preço total
    preco_total.innerHTML = `Preço Total: R$ ${calcularTotal()}`
    
}

function adicionarItem(event) {
    // evita que o site seja reiniciado toda vez que o button submit e clicado
    event.preventDefault();
    let name = document.querySelector('input[name="item_name"]').value
    let price = document.querySelector('input[name="item_price"]').value

    // verifica se o preço foi preenchido
    if (!price) {
        alert('Preencha no minimo o campo preço')
        return
    }

    lista_atual.push({name, price})
    console.log(lista_atual)
    gerarLista()
}

gerarLista()


// Envia informaçoes para o servidor


function enviar_Lista_Atual() {

    // pega a lista atual
    let insert_list = lista_atual

    // Envia informaçoes para o servidor
    fetch('http://127.0.0.1:5000/process_list', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(insert_list)
    })
}

