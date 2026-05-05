// ======================================
// INOVAMOVE v2.0 - SISTEMA AVANÇADO
// ======================================

class InovaMoveApp {
    constructor() {
        this.config = {
            fonteAtual: 16,
            altoContraste: false,
            animacoesAtivas: true,
            toastTimeout: null
        };
        
        this.elementos = {};
        this.init();
    }

    // ===============================
    // INICIALIZAÇÃO
    // ===============================
    init() {
        console.log("🚀 InovaMove v2.0 inicializado");
        
        this.cacheElementos();
        this.carregarConfiguracoes();
        this.registrarEventos();
        this.simularStatusSistema();
        this.skipLinkAcessivel();
        
        // Animações escalonadas já existem no CSS
        setTimeout(() => this.mostrarToast("Bem-vindo! Use 1-4 para navegação rápida.", "success"), 800);
    }

    // ===============================
    // CACHE DE ELEMENTOS
    // ===============================
    cacheElementos() {
        this.elementos = {
            cards: document.querySelectorAll('.card'),
            statusSistema: document.getElementById('statusSistema'),
            statusTexto: document.getElementById('statusTexto'),
            controlesAcessibilidade: document.getElementById('controlesAcessibilidade'),
            aumentarFonte: document.getElementById('aumentarFonte'),
            diminuirFonte: document.getElementById('diminuirFonte'),
            altoContraste: document.getElementById('altoContraste'),
            resetAcessibilidade: document.getElementById('resetAcessibilidade'),
            toast: document.getElementById('toast'),
            toastMensagem: document.getElementById('toastMensagem'),
            loadingOverlay: document.getElementById('loadingOverlay')
        };
    }

    // ===============================
    // NAVEGAÇÃO MELHORADA
    // ===============================
    navegar(card) {
        const pagina = card.dataset.pagina;
        const nome = card.dataset.nome;
        
        this.mostrarLoading(true);
        this.mostrarToast(`Navegando para ${nome}...`, "info");
        
        // Feedback visual avançado
        card.classList.add('navegando');
        
        // Navegação com fallback
        setTimeout(() => {
            try {
                window.location.href = pagina;
            } catch (erro) {
                console.error("❌ Erro na navegação:", erro);
                this.mostrarToast("Erro na navegação. Tente novamente.", "error");
                card.classList.remove('navegando');
                this.mostrarLoading(false);
            }
        }, 600);
    }

    // ===============================
    // SISTEMA DE TOAST
    // ===============================
    mostrarToast(mensagem, tipo = "info", duracao = 4000) {
        this.elementos.toastMensagem.textContent = mensagem;
        this.elementos.toast.className = `toast toast--${tipo}`;
        this.elementos.toast.setAttribute('role', 'status');
        
        // Animação de entrada
        this.elementos.toast.classList.add('toast--visible');
        
        // Auto-hide
        clearTimeout(this.config.toastTimeout);
        this.config.toastTimeout = setTimeout(() => {
            this.elementos.toast.classList.remove('toast--visible');
        }, duracao);
    }

    // ===============================
    // LOADING
    // ===============================
    mostrarLoading(visivel) {
        this.elementos.loadingOverlay.classList.toggle('ativo', visivel);
    }

    // ===============================
    // ACESSIBILIDADE AVANÇADA
    // ===============================
    configurarAcessibilidade() {
        // Fonte
        document.body.style.fontSize = this.config.fonteAtual + 'px';
        
        // Alto contraste (usa CSS custom properties se disponível)
        document.body.classList.toggle('alto-contraste', this.config.altoContraste);
        
        // Salvar
        localStorage.setItem('inovaMoveConfig', JSON.stringify(this.config));
    }

    alterarFonte(delta) {
        this.config.fonteAtual = Math.max(12, Math.min(28, this.config.fonteAtual + delta));
        this.configurarAcessibilidade();
        this.mostrarToast(`Fonte: ${this.config.fonteAtual}px`, "success");
    }

    alternarAltoContraste() {
        this.config.altoContraste = !this.config.altoContraste;
        this.configurarAcessibilidade();
        this.mostrarToast(this.config.altoContraste ? "Alto contraste ativado" : "Alto contraste desativado", "success");
    }

    resetarAcessibilidade() {
        this.config = { fonteAtual: 16, altoContraste: false, animacoesAtivas: true };
        document.body.style.fontSize = '';
        document.body.classList.remove('alto-contraste');
        localStorage.removeItem('inovaMoveConfig');
        this.mostrarToast("Configurações resetadas", "success");
    }

    // ===============================
    // EVENTOS
    // ===============================
    registrarEventos() {
        // Cards com navegação melhorada
        this.elementos.cards.forEach((card, index) => {
            // Click
            card.addEventListener('click', () => this.navegar(card));
            
            // Enter/Space (teclado)
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.navegar(card);
                }
            });
            
            // Atalho numérico
            card.addEventListener('keydown', (e) => {
                if (e.key === (index + 1).toString()) {
                    e.preventDefault();
                    this.navegar(card);
                    this.mostrarToast(`Atalho ${e.key} ativado!`, "success");
                }
            });
        });

        // Controles de acessibilidade
        this.elementos.aumentarFonte.addEventListener('click', () => this.alterarFonte(2));
        this.elementos.diminuirFonte.addEventListener('click', () => this.alterarFonte(-2));
        this.elementos.altoContraste.addEventListener('click', () => this.alternarAltoContraste());
        this.elementos.resetAcessibilidade.addEventListener('click', () => this.resetarAcessibilidade());

        // Teclado global
        document.addEventListener('keydown', (e) => {
            // Ctrl + / Ctrl -
            if (e.ctrlKey && e.key === '+') { e.preventDefault(); this.alterarFonte(2); }
            if (e.ctrlKey && e.key === '-') { e.preventDefault(); this.alterarFonte(-2); }
            
            // F10 = Acessibilidade
            if (e.key === 'F10') {
                e.preventDefault();
                this.elementos.controlesAcessibilidade.classList.toggle('visivel');
            }
        });

        // Focus management
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('focus', () => {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    // ===============================
    // PERSISTÊNCIA
    // ===============================
    carregarConfiguracoes() {
        const configSalva = localStorage.getItem('inovaMoveConfig');
        if (configSalva) {
            this.config = { ...this.config, ...JSON.parse(configSalva) };
            this.configurarAcessibilidade();
        }
    }

    // ===============================
    // STATUS DO SISTEMA
    // ===============================
    simularStatusSistema() {
        const status = ['Sistema ativo', 'Conectado', 'Online', 'Disponível'];
        let index = 0;
        
        setInterval(() => {
            index = (index + 1) % status.length;
            this.elementos.statusTexto.textContent = status[index];
        }, 8000);
    }

    // ===============================
    // SKIP LINK
    // ===============================
    skipLinkAcessivel() {
        const skipLink = document.querySelector('.skip-link');
        skipLink.addEventListener('focus', () => {
            skipLink.classList.add('visivel');
        });
        skipLink.addEventListener('blur', () => {
            skipLink.classList.remove('visivel');
        });
    }
}

// ===============================
/* INICIALIZAÇÃO AUTOMÁTICA */
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    window.app = new InovaMoveApp();
});

// Tratamento de erros globais
window.addEventListener('error', (e) => {
    console.error('Erro capturado:', e.error);
    if (window.app) {
        window.app.mostrarToast('Erro detectado. Recarregando configurações...', 'warning');
    }
});
