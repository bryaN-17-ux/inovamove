/* ==========================================================================
   InovaMove — Lógica da página Acessibilidade
   Mexer nos controles aqui só dá uma PRÉVIA visual nesta página (não é
   gravado ainda). Só quando o usuário clica em "Salvar Configurações"
   é que a preferência é gravada em localStorage e passa a valer nas
   outras páginas do site (via assets/js/accessibility.js).
   ========================================================================== */

let perfilAtual = null;

// ── Lê os controles da tela e aplica visualmente (SEM gravar) ──
function aplicarPreview() {
  const config = {
    perfil: perfilAtual,
    contraste: document.getElementById('toggle-contraste').checked,
    leitor: document.getElementById('toggle-leitor').checked,
    vibra: document.getElementById('toggle-vibra').checked,
    fonte: Number(document.getElementById('slider-fonte').value)
  };
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
  aplicarPreview();
}

// 2. TAMANHO DA FONTE (ZOOM) — só prévia
function updateFont(v) {
  const labels = ['Pequeno', 'Normal', 'Grande'];
  document.getElementById('font-val').textContent = labels[v - 1];
  aplicarPreview();
}

// 3. VIBRAÇÃO (teste imediato ao ligar, não depende de salvar)
function testarVibracao(ativo) {
  if (ativo && navigator.vibrate) {
    navigator.vibrate(200); // Vibra por 200ms
  }
}

// 4. SALVAR CONFIGURAÇÕES — aqui sim grava de verdade e vale nas outras páginas
function salvar() {
  const config = {
    perfil: perfilAtual,
    contraste: document.getElementById('toggle-contraste').checked,
    leitor: document.getElementById('toggle-leitor').checked,
    vibra: document.getElementById('toggle-vibra').checked,
    fonte: Number(document.getElementById('slider-fonte').value)
  };

  salvarConfigAcessibilidade(config);
  aplicarConfigAcessibilidade(config);

  const t = document.getElementById('toast');
  t.classList.add('show');

  if (config.vibra && navigator.vibrate) {
    navigator.vibrate([100, 50, 100]); // Padrão de vibração de sucesso
  }

  setTimeout(() => t.classList.remove('show'), 3000);
}

// 5. Ao abrir a página, refletir nos controles o que já estava SALVO
//    (não o que estava só em prévia — prévia não sobrevive a um recarregamento)
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
  // Não precisa chamar aplicarConfigAcessibilidade aqui: o accessibility.js
  // já aplica a config salva automaticamente assim que a página carrega.
});
