/* ==========================================================================
   InovaMove — Lógica da página Acessibilidade
   Perfis pré-configurados, alto contraste, tamanho de fonte, vibração
   e leitor de tela. Este arquivo só cuida da INTERFACE desta página;
   quem guarda e aplica as preferências em todo o site é o
   assets/js/accessibility.js (carregado antes deste, em toda página).
   ========================================================================== */

let perfilAtual = null;

// ── Grava o estado atual dos controles e aplica na hora ──
function persistirConfiguracoes() {
  const config = {
    perfil: perfilAtual,
    contraste: document.getElementById('toggle-contraste').checked,
    leitor: document.getElementById('toggle-leitor').checked,
    vibra: document.getElementById('toggle-vibra').checked,
    fonte: Number(document.getElementById('slider-fonte').value)
  };
  salvarConfigAcessibilidade(config);
  aplicarConfigAcessibilidade(config);
}

// 1. SELEÇÃO DE PERFIL E AUTOMAÇÃO
function selecionarPerfil(el, tipo) {
  document.querySelectorAll('.perfil-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  perfilAtual = tipo;

  const contraste = document.getElementById('toggle-contraste');
  const leitor = document.getElementById('toggle-leitor');
  const vibra = document.getElementById('toggle-vibra');
  const slider = document.getElementById('slider-fonte');

  // Reseta tudo
  contraste.checked = false; leitor.checked = false; vibra.checked = true; slider.value = 2;

  // Aplica presets baseados no perfil
  if (tipo === 'visual') {
    contraste.checked = true;
    leitor.checked = true;
  } else if (tipo === 'auditiva') {
    vibra.checked = true;
  } else if (tipo === 'idoso') {
    slider.value = 3;
  }

  updateFont(slider.value);
  persistirConfiguracoes();
}

// 2. TAMANHO DA FONTE (ZOOM)
function updateFont(v) {
  const labels = ['Pequeno', 'Normal', 'Grande'];
  document.getElementById('font-val').textContent = labels[v - 1];
  persistirConfiguracoes();
}

// 3. VIBRAÇÃO (teste imediato ao ligar)
function testarVibracao(ativo) {
  if (ativo && navigator.vibrate) {
    navigator.vibrate(200); // Vibra por 200ms
  }
}

// 4. SALVAR CONFIGURAÇÕES (grava e mostra confirmação)
function salvar() {
  persistirConfiguracoes();

  const t = document.getElementById('toast');
  t.classList.add('show');

  const vibraAtivo = document.getElementById('toggle-vibra').checked;
  if (vibraAtivo && navigator.vibrate) {
    navigator.vibrate([100, 50, 100]); // Padrão de vibração de sucesso
  }

  setTimeout(() => t.classList.remove('show'), 3000);
}

// 5. Ao abrir a página, refletir nos controles o que já estava salvo
document.addEventListener('DOMContentLoaded', function () {
  const config = getConfigAcessibilidade();
  perfilAtual = config.perfil;

  document.getElementById('toggle-contraste').checked = config.contraste;
  document.getElementById('toggle-leitor').checked = config.leitor;
  document.getElementById('toggle-vibra').checked = config.vibra;
  document.getElementById('slider-fonte').value = config.fonte;

  const labels = ['Pequeno', 'Normal', 'Grande'];
  document.getElementById('font-val').textContent = labels[config.fonte - 1];

  if (config.perfil) {
    const card = document.querySelector(`.perfil-card[data-perfil="${config.perfil}"]`);
    if (card) card.classList.add('selected');
  }
  // Não chama aplicarConfigAcessibilidade aqui: o accessibility.js já
  // aplica automaticamente assim que a página carrega.
});
