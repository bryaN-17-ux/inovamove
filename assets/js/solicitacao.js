/* ==========================================================================
   InovaMove — Lógica da página Solicitar Embarque
   Seleção de necessidades e envio da solicitação ao motorista.
   ========================================================================== */

function toggleChip(el) {
  el.classList.toggle('selected');
}

function enviarSolicitacao() {
  document.getElementById('overlay').classList.add('show');
}

function fecharOverlay() {
  document.getElementById('overlay').classList.remove('show');
}
