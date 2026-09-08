/* ==========================================================================
   InovaMove — Acessibilidade compartilhada entre páginas
   Este arquivo deve ser carregado em TODAS as páginas do site (antes do
   script específico de cada página, se houver). Ele lê as preferências
   salvas em localStorage e aplica em qualquer tela: alto contraste,
   tamanho de fonte, leitor de tela e vibração ao interagir com botões
   de ação. A página acessibilidade.html usa as mesmas funções para
   gravar as preferências quando o usuário muda alguma opção.
   ========================================================================== */

const ACESSIBILIDADE_KEY = 'inovamove-acessibilidade';

const ACESSIBILIDADE_PADRAO = {
  perfil: null,
  contraste: false,
  leitor: false,
  vibra: true,
  fonte: 2 // 1 = Pequeno, 2 = Normal, 3 = Grande
};

// ── Lê as preferências salvas (ou os valores padrão, se nunca foi salvo) ──
function getConfigAcessibilidade() {
  try {
    const salvo = localStorage.getItem(ACESSIBILIDADE_KEY);
    if (!salvo) return { ...ACESSIBILIDADE_PADRAO };
    return { ...ACESSIBILIDADE_PADRAO, ...JSON.parse(salvo) };
  } catch (e) {
    return { ...ACESSIBILIDADE_PADRAO };
  }
}

// ── Grava as preferências para valerem em todas as páginas ──
function salvarConfigAcessibilidade(config) {
  localStorage.setItem(ACESSIBILIDADE_KEY, JSON.stringify(config));
}

// ── Aplica visualmente as preferências na página atual ──
function aplicarConfigAcessibilidade(config) {
  // Alto contraste (as cores em si estão em assets/css/base.css)
  document.body.classList.toggle('high-contrast', !!config.contraste);

  // Tamanho da fonte / zoom da página inteira
  let zoomLevel = '100%';
  if (config.fonte == 1) zoomLevel = '90%';
  if (config.fonte == 3) zoomLevel = '115%';
  document.body.style.zoom = zoomLevel;

  // Disponibiliza para os listeners abaixo saberem se estão ativos
  window.__leitorDeTelaAtivo = !!config.leitor;
  window.__vibracaoAtiva = !!config.vibra;
}

// ── Aplica assim que a página carrega, em qualquer tela do site ──
document.addEventListener('DOMContentLoaded', function () {
  aplicarConfigAcessibilidade(getConfigAcessibilidade());
});

// ── Leitor de tela: funciona em qualquer página, não só na de acessibilidade ──
document.addEventListener('click', function (e) {
  if (!window.__leitorDeTelaAtivo) return;
  if (['INPUT', 'LABEL', 'SPAN'].includes(e.target.tagName)) return;

  const texto = e.target.innerText || e.target.textContent;
  if (texto && texto.trim() !== '') {
    window.speechSynthesis.cancel();
    const leitura = new SpeechSynthesisUtterance(texto.trim());
    leitura.lang = 'pt-BR';
    leitura.rate = 1.0;
    window.speechSynthesis.speak(leitura);
  }
});

// ── Vibração: dá feedback tátil ao tocar em botões de ação, em qualquer página ──
document.addEventListener('click', function (e) {
  if (!window.__vibracaoAtiva || !navigator.vibrate) return;
  const alvo = e.target.closest('.send-btn, .confirm-btn, .save-btn, .nav-item');
  if (alvo) navigator.vibrate(60);
});

// ── PWA: registra o service worker para o app poder ser instalado e
//    abrir mais rápido / funcionar offline nas páginas já visitadas ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function (erro) {
      console.warn('Não foi possível registrar o service worker:', erro);
    });
  });
}
