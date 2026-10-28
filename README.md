# InovaMove

Aplicativo web de mobilidade urbana acessível para o transporte público de Vitória-ES (Transcol). Permite rastrear ônibus em tempo real, solicitar embarque, configurar acessibilidade e avaliar viagens.

## 📁 Estrutura do projeto

```
inovamove/
├── index.html              # Página inicial
├── mapa.html                # Mapa com rastreamento de linhas em tempo real
├── solicitacao.html         # Solicitação de embarque ao motorista
├── acessibilidade.html      # Configurações de acessibilidade
├── feedback.html            # Avaliação de viagens
├── sobre.html                # Sobre o projeto e a equipe
│
└── assets/
    ├── css/
    │   ├── variables.css     # Design tokens (cores, sombras) usados em todo o site
    │   ├── base.css           # Reset, header, nav, e componentes compartilhados
    │   ├── home.css           # Estilos exclusivos do index.html
    │   ├── mapa.css           # Estilos exclusivos do mapa.html
    │   ├── solicitacao.css    # Estilos exclusivos do solicitacao.html
    │   ├── acessibilidade.css # Estilos exclusivos do acessibilidade.html
    │   ├── feedback.css       # Estilos exclusivos do feedback.html
    │   └── sobre.css          # Estilos exclusivos do sobre.html
    │
    ├── js/
    │   ├── mapa.js             # Integração com Leaflet + Overpass API
    │   ├── solicitacao.js      # Lógica da tela de solicitação
    │   ├── acessibilidade.js   # Perfis, alto contraste, leitor de tela, vibração
    │   └── feedback.js         # Lógica da tela de avaliação
    │
    └── img/
        └── logo.png
```

## Por que essa organização?

- **Separação por responsabilidade**: HTML cuida só da estrutura, CSS do visual e JS do comportamento — nada de `<style>` ou `<script>` inline gigante misturado no meio da página.
- **`base.css` + `variables.css`**: tudo que se repete em várias páginas (cores, cabeçalho, menu inferior, botões, cartão de confirmação) vive em um único lugar. Mudou uma cor da marca? Muda em um arquivo só.
- **Um CSS/JS por página**: cada página só carrega o que é específico dela, facilitando encontrar e editar o código de uma tela sem mexer nas outras.
- **`assets/`**: pasta padrão do mercado para agrupar tudo que não é HTML (estilos, scripts, imagens), separando conteúdo de apresentação.

## Como rodar

Não há build nem dependências para instalar. Basta abrir `index.html` no navegador, ou servir a pasta com qualquer servidor estático, por exemplo:

```bash
npx serve .
# ou
python3 -m http.server
```

## Tecnologias

HTML5, CSS3, JavaScript puro, [Leaflet.js](https://leafletjs.com/) + OpenStreetMap para o mapa, e [Overpass API](https://overpass-api.de/) para buscar as linhas de ônibus reais.
