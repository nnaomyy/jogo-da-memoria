const cartas = document.querySelectorAll('.carta');
const cronometro = document.querySelector('#cronometro');
const mensagem = document.querySelector('#mensagem');
const botaoReiniciar = document.querySelector('#reiniciar');
const pontuacao = document.querySelector('#pontuacao');


let cartaVirada = false;
let lockboard = false;
let primeiraCarta, segundaCarta;
let paresEncontrados = 0;

let tempo = 0;
let intervalo = null;

function iniciarCronometro() {

    if (intervalo) return;

    intervalo = setInterval(() => {

        tempo++;
        cronometro.textContent =
            String(tempo).padStart(3, '0');

    }, 1000);
}

function pararCronometro() {

    clearInterval(intervalo);
    intervalo = null;
}

function virarCarta() {

    if (lockboard) return;
    if (this === primeiraCarta) return;
    iniciarCronometro();
    this.classList.add('virar');

    if (!cartaVirada) {

        cartaVirada = true;
        primeiraCarta = this;

        return;
    }

    segundaCarta = this;

    calcular();
}

function calcular() {

    let isMatch =
        primeiraCarta.dataset.framework ===
        segundaCarta.dataset.framework;

    isMatch ? acertou() : desvirarCartas();
}

function acertou() {

    primeiraCarta.removeEventListener('click', virarCarta);
    segundaCarta.removeEventListener('click', virarCarta);
    paresEncontrados++;
    pontuacao.textContent = `${paresEncontrados}/9`;

    if (paresEncontrados === cartas.length / 2) {

        fimDeJogo();
    }

    resetarJogada();
    
}

function desvirarCartas() {

    lockboard = true;

    setTimeout(() => {

        primeiraCarta.classList.remove('virar');
        segundaCarta.classList.remove('virar');

        resetarJogada();

    }, 1500);
}

function resetarJogada() {

    [cartaVirada, lockboard] = [false, false];
    [primeiraCarta, segundaCarta] = [null, null];
}

function fimDeJogo() {

    pararCronometro();
    mensagem.textContent = ` Parabéns! Você ganhou em ${tempo} segundos!`;
}

function reiniciarJogo() {

    pararCronometro();

    tempo = 0;
    paresEncontrados = 0;
    cronometro.textContent = '000';
    pontuacao.textContent = '0/9';
    mensagem.textContent = '';

    resetarJogada();

    cartas.forEach(carta => {

        carta.classList.remove('virar');
        carta.addEventListener('click', virarCarta);
    });

    embaralharCartas();
}

function embaralharCartas() {

    cartas.forEach(carta => {

        let randomPos =
            Math.floor(Math.random() * 12);

        carta.style.order = randomPos;
    });
}

botaoReiniciar.addEventListener(
    'click',
    reiniciarJogo
);

embaralharCartas();

cartas.forEach(carta =>
    carta.addEventListener('click', virarCarta)
);