// ===============================
// NAVEGAÇÃO ENTRE PÁGINAS
// ===============================
function irPara(caminho) {
    try {
        window.location.href = caminho;
    } catch (erro) {
        console.error("Erro ao navegar:", erro);
    }
}


// ===============================
// INICIALIZAÇÃO
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    console.log("InovaMove iniciado");

    aplicarAcessibilidade();
    adicionarFeedbackVisual();
});


// ===============================
// ACESSIBILIDADE
// ===============================
function aplicarAcessibilidade() {
    
    // Aumentar fonte com "+"
    document.addEventListener("keydown", (e) => {
        if (e.key === "+") {
            alterarFonte(2);
        }

        if (e.key === "-") {
            alterarFonte(-2);
        }
    });

    // Salvar preferência no navegador
    const fonteSalva = localStorage.getItem("fonte");
    if (fonteSalva) {
        document.body.style.fontSize = fonteSalva;
    }
}


// Função que altera o tamanho da fonte
function alterarFonte(valor) {
    const body = document.body;

    let tamanhoAtual = window.getComputedStyle(body).fontSize;
    tamanhoAtual = parseFloat(tamanhoAtual);

    let novoTamanho = tamanhoAtual + valor;

    // Limites (evita quebrar layout)
    if (novoTamanho < 14) novoTamanho = 14;
    if (novoTamanho > 24) novoTamanho = 24;

    body.style.fontSize = novoTamanho + "px";

    // Salvar preferência
    localStorage.setItem("fonte", body.style.fontSize);
}


// ===============================
// FEEDBACK VISUAL NOS CARDS
// ===============================
function adicionarFeedbackVisual() {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.style.transform = "scale(0.97)";
            
            setTimeout(() => {
                card.style.transform = "";
            }, 150);
        });
    });
}