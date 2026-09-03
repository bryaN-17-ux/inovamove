/* ==========================================================================
   InovaMove — Lógica da página Avaliar
   Estrelas de avaliação, seleção de chips e envio do formulário.
   ========================================================================== */

const ratings = {};

function setRating(id, val) {
  ratings[id] = val;
  const stars = document.querySelectorAll(`#stars-${id} .star`);
  stars.forEach((s, i) => {
    s.textContent = i < val ? '⭐' : '☆';
    s.classList.toggle('active', i < val);
  });
}

function toggleChip(el) {
  el.classList.toggle('selected');
}

function enviar() {
  document.getElementById('overlay').classList.add('show');
}

function fechar() {
  document.getElementById('overlay').classList.remove('show');
  window.location.href = 'index.html';
}
