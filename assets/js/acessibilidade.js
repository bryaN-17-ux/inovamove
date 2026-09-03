/* ==========================================================================
   InovaMove — Lógica da página Acessibilidade
   Perfis pré-configurados, alto contraste, tamanho de fonte, vibração
   e leitor de tela (Speech Synthesis API).
   ========================================================================== */

// 1. SELEÇÃO DE PERFIL E AUTOMAÇÃO
function selecionarPerfil(el, tipo) {
  document.querySelectorAll('.perfil-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');

  const contraste = document.getElementById('toggle-contraste');
  const leitor = document.getElementById('toggle-leitor');
  const vibra = document.getElementById('toggle-vibra');
  const slider = document.getElementById('slider-fonte');

  // Reseta tudo
  contraste.checked = false; leitor.checked = false; vibra.checked = false; slider.value = 2;

  // Aplica presets baseados no perfil
  if (tipo === 'visual') {
    contraste.checked = true;
    leitor.checked = true;
  } else if (tipo === 'auditiva') {
    vibra.checked = true;
  } else if (tipo === 'idoso') {
    slider.value = 3;
  }

  // Dispara eventos para aplicar visualmente
  aplicarAltoContraste(contraste.checked);
  updateFont(slider.value);
}

// 2. TAMANHO DA FONTE (ZOOM)
function updateFont(v) {
  const labels = ['Pequeno', 'Normal', 'Grande'];
  document.getElementById('font-val').textContent = labels[v - 1];

  // Aplica zoom no body para simular aumento de fonte geral
  let zoomLevel = "100%";
  if (v == 1) zoomLevel = "90%";
  if (v == 3) zoomLevel = "115%";

  document.body.style.zoom = zoomLevel;
}

// 3. ALTO CONTRASTE
function aplicarAltoContraste(ativo) {
  if (ativo) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }
}

// 4. VIBRAÇÃO
function testarVibracao(ativo) {
  if (ativo && navigator.vibrate) {
    navigator.vibrate(200); // Vibra por 200ms
  }
}

// 5. LEITOR DE TELA (Speech Synthesis API)
document.addEventListener('click', function (e) {
  const leitorAtivo = document.getElementById('toggle-leitor').checked;

  // Se o leitor estiver ligado e o elemento clicado não for um input/botão de toggle
  if (leitorAtivo && e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL' && e.target.tagName !== 'SPAN') {
    let textoParaLer = e.target.innerText || e.target.textContent;

    // Pega apenas o texto mais próximo se clicar num container muito grande
    if (textoParaLer && textoParaLer.trim() !== "") {
      window.speechSynthesis.cancel(); // Para fala anterior
      let leitura = new SpeechSynthesisUtterance(textoParaLer.trim());
      leitura.lang = 'pt-BR';
      leitura.rate = 1.0;
      window.speechSynthesis.speak(leitura);
    }
  }
});

// 6. SALVAR CONFIGURAÇÕES
function salvar() {
  const t = document.getElementById('toast');
  t.classList.add('show');

  // Feedback de vibração ao salvar
  const vibraAtivo = document.getElementById('toggle-vibra').checked;
  if (vibraAtivo && navigator.vibrate) {
    navigator.vibrate([100, 50, 100]); // Padrão de vibração de sucesso
  }

  setTimeout(() => t.classList.remove('show'), 3000);
}
