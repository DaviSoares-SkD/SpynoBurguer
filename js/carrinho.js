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
    const popup = document.getElementById("popup");
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

    popup.textContent = `${nome} foi adicionado ao carrinho! ✅`;
    popup.classList.add("mostrar");

    setTimeout(() => {
        popup.classList.remove("mostrar");
    }, 3000);
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
    const avisoVazio = document.getElementById("vazio")

    if (carrinho.length ===0){
        avisoVazio.innerHTML = `Seu Carrinho está vazio <br> 
            <button class="callToAction">
                <a href="menu.html">Fazer meu pedido &#x1F35F;</a>
            </button>`

    }

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
            <i class="bi-trash-fill"></i>
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

    const nome = document.getElementById("nome").value.trim();
    const observacoes = document.getElementById("obs").value.trim();
    const pagamento = document.getElementById("pag").value;

    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // Verifica se o nome foi preenchido
    if (nome === "") {
        alert("Digite seu nome!");
        document.getElementById("nome").focus();
        return;
    }

    // Verifica se a forma de pagamento foi escolhida
    if (pagamento === "") {
        alert("Selecione uma forma de pagamento!");
        document.getElementById("pag").focus();
        return;
    }

    // Transforma o valor do select em um texto mais bonito
    let pagamentoTexto;

    if (pagamento === "debito") {
        pagamentoTexto = "Débito";
    } else if (pagamento === "credito") {
        pagamentoTexto = "Crédito";
    } else if (pagamento === "pix") {
        pagamentoTexto = "Pix";
    }

    let mensagem = "Pedido do Carrinho:\n\n";

    mensagem += `👤 Nome: ${nome}\n\n`;

    let total = 0;

    carrinho.forEach(item => {

        const subtotal = item.preco * item.quantidade;

        total += subtotal;

        mensagem += `• ${item.nome} x${item.quantidade} = R$ ${subtotal.toFixed(2)}\n`;
    });

    mensagem += `\n📝 Observações: ${observacoes || "Nenhuma"}`;

    mensagem += `\n💳 Pagamento:${pagamentoTexto}`;

    mensagem += `\n\n💰 Total: R$ ${total.toFixed(2)}*`;

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

