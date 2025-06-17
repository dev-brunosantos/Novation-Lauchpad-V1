let midiAccess = null;
let midiOutput = null;
const logElem = document.getElementById('log');
const midiOutSelect = document.getElementById('midi-out-select');
const connectBtn = document.getElementById('connect-btn');

function log(msg) {
    logElem.textContent += msg + '\n';
    logElem.scrollTop = logElem.scrollHeight;
}

function onMIDISuccess(midi) {
    midiAccess = midi;
    log('MIDI acessado com sucesso.');
    updateMidiOutputs();
}

function onMIDIFailure() {
    log('Falha ao acessar MIDI.');
}

function updateMidiOutputs() {
    midiOutSelect.innerHTML = '';
    for (let output of midiAccess.outputs.values()) {
        let option = document.createElement('option');
        option.value = output.id;
        option.textContent = output.name;
        midiOutSelect.appendChild(option);
    }
    if (midiOutSelect.options.length > 0) {
        midiOutSelect.selectedIndex = 0;
        midiOutput = midiAccess.outputs.get(midiOutSelect.value);
        log('Saída MIDI selecionada: ' + midiOutput.name + "\n");
    } else {
        log('Nenhuma saída MIDI encontrada.');
    }
}

connectBtn.addEventListener('click', () => {
    if (!navigator.requestMIDIAccess) {
        log('Web MIDI API não suportada no seu navegador.');
        return;
    }
    navigator.requestMIDIAccess({ sysex: true })
        .then(onMIDISuccess, onMIDIFailure);
});

midiOutSelect.addEventListener('change', () => {
    midiOutput = midiAccess.outputs.get(midiOutSelect.value);
    log('Saída MIDI alterada para: ' + midiOutput.name + "\n");
});

window.addEventListener('keydown', (e) => {
    const tecla = keyMapDown[e.keyCode];
    if (tecla) alteraPads(tecla)
})
window.addEventListener('keyup', (e) => {
    const tecla = keyMapUp[e.keyCode];
    if (tecla) alteraPads(tecla)
})

function alteraPads(array) {
    array.forEach(letra => {
        midiOutput.send(letra);
    })
}

// ----------------------------------

const animacao = document.getElementById('animacao')
const apagar = document.getElementById('apagar')

animacao.addEventListener('click', () => {

    var on = 144
    var posicao = 99
    var color = 5
    var subindo = false
    var repeticao = 0
    var maxRepeticoes = 4
    var chegouNoLimiteInferior = false

    var loop = setInterval(() => {
        if (posicao <= 10) {
            subindo = true
            on = 128

            if (!chegouNoLimiteInferior) {
                repeticao++

                if (repeticao == 1) { color = 60 }
                if (repeticao == 2) { color = 50 }
                if (repeticao == 3) { color = 3 }

                chegouNoLimiteInferior = true
            }
        } else if (posicao >= 99) {
            subindo = false
            on = 144
            chegouNoLimiteInferior = false
        }

        if (repeticao >= maxRepeticoes) {
            clearInterval(loop)
            setTimeout(() => {
                for (let nota = 11; nota <= 99; nota++) {
                    midiOutput.send([128, nota, 0]);
                }
            }, 500)
            return
        }

        posicao += subindo ? 11 : -1

        var msg = [on, posicao, color]
        midiOutput.send(msg)

    }, 0.1)



    // loop(letraB, 500)
    // loop(letraBOF, 1000)
    // loop(letraR, 1500)
    // loop(letraROF, 2000)
    // loop(letraU, 2500)
    // loop(letraUOF, 3000)
    // loop(letraN, 3500)
    // loop(letraNOF, 4000)
    // loop(letraO, 4500)
    // loop(letraOOF, 5000)
})

function loop(array, tempo) {
    setTimeout(() => {
        alteraPads(array)
    }, tempo)
}

// apagar.addEventListener('click', () => {
//     for (let nota = 11; nota <= 99; nota++) {
//         midiOutput.send([128, nota, 0]);
//     }
// })