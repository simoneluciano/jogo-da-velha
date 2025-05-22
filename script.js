let placarX = 0;
let placarO = 0;
let placarEmpate = 0;

// Selecionando elementos do DOM
const tabuleiro = document.getElementById('tabuleiro');
const celulas = document.querySelectorAll('[data-celula]');
const mensagem = document.getElementById('mensagem');
const botaoReiniciar = document.getElementById('reiniciar');
let contraComputador = false;
const botaoModoComputador = document.getElementById('modoComputador');

// Variáveis de controle do jogo
let jogadorAtual = 'X';
let jogoAtivo = true;

// Combinações vencedoras possíveis
const combinacoesVencedoras = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6] // Diagonais
];

// Função para atualizar placar na tela
function atualizarPlacar() {
  document.getElementById('placarX').textContent = placarX;
  document.getElementById('placarO').textContent = placarO;
  document.getElementById('placarEmpate').textContent = placarEmpate;
}

// Função para lidar com o clique em uma célula
function lidarComCliqueCelula(e) {
    const celula = e.target;
    const indiceCelula = Array.from(celulas).indexOf(celula);
    
    if (celula.textContent !== '' || !jogoAtivo) return;

    celula.textContent = jogadorAtual;

    const comboVencedor = verificarVitoria();
    if (comboVencedor) {
        destacarCelulasVencedoras(comboVencedor);
        mensagem.textContent = `🎉 Jogador ${jogadorAtual} venceu!`;
        jogoAtivo = false;

        if (jogadorAtual === 'X') placarX++;
        else placarO++;

        atualizarPlacar();
        return;
    }

    if (verificarEmpate()) {
        mensagem.textContent = '🤝 Empate!';
        jogoAtivo = false;
        placarEmpate++;
        atualizarPlacar();
        return;
    }

    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
    mensagem.textContent = `Vez do jogador ${jogadorAtual}`;

    if (contraComputador && jogadorAtual === 'O') {
        setTimeout(jogadaComputador, 500);
    }
}

// Função para verificar vitória e retornar combinação vencedora
function verificarVitoria() {
    return combinacoesVencedoras.find(combinacao => {
        return combinacao.every(indice => celulas[indice].textContent === jogadorAtual);
    });
}

// Função para destacar as células vencedoras
function destacarCelulasVencedoras(combo) {
    combo.forEach(indice => {
        celulas[indice].classList.add('vencedor');
    });
}

// Função para verificar empate
function verificarEmpate() {
    return [...celulas].every(celula => celula.textContent !== '');
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    jogadorAtual = 'X';
    jogoAtivo = true;
    celulas.forEach(celula => {
        celula.textContent = '';
        celula.classList.remove('vencedor');
    });
    mensagem.textContent = `Vez do jogador ${jogadorAtual}`;
}

// Jogada do computador
function jogadaComputador() {
    if (!jogoAtivo) return;

    // Tenta ganhar
    for (let i = 0; i < combinacoesVencedoras.length; i++) {
        const [a, b, c] = combinacoesVencedoras[i];
        const valores = [celulas[a].textContent, celulas[b].textContent, celulas[c].textContent];
        
        if (valores.filter(v => v === 'O').length === 2 && valores.filter(v => v === '').length === 1) {
            const indiceVazio = [a, b, c].find(i => celulas[i].textContent === '');
            celulas[indiceVazio].textContent = 'O';
            verificarResultado();
            return;
        }
    }

    // Bloqueia jogador
    for (let i = 0; i < combinacoesVencedoras.length; i++) {
        const [a, b, c] = combinacoesVencedoras[i];
        const valores = [celulas[a].textContent, celulas[b].textContent, celulas[c].textContent];
        
        if (valores.filter(v => v === 'X').length === 2 && valores.filter(v => v === '').length === 1) {
            const indiceVazio = [a, b, c].find(i => celulas[i].textContent === '');
            celulas[indiceVazio].textContent = 'O';
            verificarResultado();
            return;
        }
    }

    // Joga aleatório
    const celulasVazias = [...celulas].filter(c => c.textContent === '');
    if (celulasVazias.length === 0) return;

    const celulaAleatoria = celulasVazias[Math.floor(Math.random() * celulasVazias.length)];
    celulaAleatoria.textContent = 'O';
    verificarResultado();
}

function verificarResultado() {
    const comboVencedor = verificarVitoria();
    if (comboVencedor) {
        destacarCelulasVencedoras(comboVencedor);
        mensagem.textContent = `💻 Computador venceu!`;
        jogoAtivo = false;
        placarO++;
        atualizarPlacar();
        return;
    }

    if (verificarEmpate()) {
        mensagem.textContent = '🤝 Empate!';
        jogoAtivo = false;
        placarEmpate++;
        atualizarPlacar();
        return;
    }

    jogadorAtual = 'X';
    mensagem.textContent = `Vez do jogador ${jogadorAtual}`;
}

// Adicionando event listeners
celulas.forEach(celula => celula.addEventListener('click', lidarComCliqueCelula));
botaoReiniciar.addEventListener('click', reiniciarJogo);
botaoModoComputador.addEventListener('click', () => {
    contraComputador = !contraComputador;
    botaoModoComputador.textContent = contraComputador
        ? 'Modo: Jogador vs Computador'
        : 'Modo: Jogador vs Jogador';
    reiniciarJogo();
});

// Inicializa placar e mensagem
atualizarPlacar();
mensagem.textContent = `Vez do jogador ${jogadorAtual}`;
