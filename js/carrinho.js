// ===============================
// Carrinho
// ===============================

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Salva no Local Storage
function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Adicionar produto
function addcar(nome, preco) {

    const item = carrinho.find(produto => produto.nome === nome);

    if (item) {
        item.quantidade++;
    } else {
        carrinho.push({
            nome,
            preco,
            quantidade: 1
        });
    }

    salvarCarrinho();
    mostrarCarrinho();
}

// Aumentar quantidade
function aumentar(nome) {

    const item = carrinho.find(produto => produto.nome === nome);

    if(item){
        item.quantidade++;
    }

    salvarCarrinho();
    mostrarCarrinho();
}

// Diminuir quantidade
function diminuir(nome){

    const item = carrinho.find(produto => produto.nome === nome);

    if(item){

        item.quantidade--;

        if(item.quantidade <= 0){
            carrinho = carrinho.filter(produto => produto.nome !== nome);
        }
    }

    salvarCarrinho();
    mostrarCarrinho();
}

// Remover produto
function remover(nome){

    carrinho = carrinho.filter(produto => produto.nome !== nome);

    salvarCarrinho();
    mostrarCarrinho();
}

// Mostrar carrinho
function mostrarCarrinho(){

    const lista = document.getElementById("listaCarrinho");
    const total = document.getElementById("total");

    if(!lista || !total) return;

    lista.innerHTML = "";

    let valorTotal = 0;

    carrinho.forEach(item=>{

        valorTotal += item.preco * item.quantidade;

  lista.innerHTML += `
<div class="item">

    <div class="item-info">
        <h3>${item.nome}</h3>
        <p>R$ ${item.preco.toFixed(2)}</p>
    </div>

    <div class="item-actions">

        <button class="btn-minus" onclick="diminuir('${item.nome}')">−</button>

        <span class="qtd">${item.quantidade}</span>

        <button class="btn-plus" onclick="aumentar('${item.nome}')">+</button>

        <button class="btn-delete" onclick="remover('${item.nome}')">
            🗑️
        </button>

    </div>

</div>
`;
    });

    total.innerHTML =
        `Total: R$ ${valorTotal.toFixed(2)}`;
}

// Carrega automaticamente
mostrarCarrinho();


// ===============================
// Finalizar pedido (WhatsApp)
// ===============================

function finalizarPedido() {

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "🛒 *Pedido do Carrinho:*\n\n";
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        mensagem += `• ${item.nome} x${item.quantidade} = R$ ${subtotal.toFixed(2)}\n`;
    });

    mensagem += `\n💰 *Total: R$ ${total.toFixed(2)}*`;

    navigator.clipboard.writeText(mensagem)
        .then(() => {

            alert("Pedido copiado! Abrindo WhatsApp...");

            const numero = "5511999999999"; // <-- troca aqui
            const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

            window.open(url, "_blank");

        })
        .catch(() => {
            alert("Não consegui copiar automaticamente 😕");
        });
}