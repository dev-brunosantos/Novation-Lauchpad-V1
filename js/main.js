let midiAccess = null;
let midiOutput = null;
const logElem = document.getElementById('log');
const midiOutSelect = document.getElementById('midi-out-select');
const connectBtn = document.getElementById('connect-btn');
const sendLedBtn = document.getElementById('send-led-btn');
const apagar = document.getElementById('apagar');

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
        sendLedBtn.disabled = false;
        apagar.disabled = false;
        log('Saída MIDI selecionada: ' + midiOutput.name);
    } else {
        sendLedBtn.disabled = true;
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
    log('Saída MIDI alterada para: ' + midiOutput.name);
});

window.addEventListener('keydown', (e) => {
    const tecla = keyMapDown[e.keyCode];
    if (tecla) alteraPads(tecla)
})
window.addEventListener('keyup', (e) => {
    const tecla = keyMapUp[e.keyCode];
    if (tecla) alteraPads(tecla)
})

// ---------------------------------------------------------

// const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const btnLetras = document.querySelectorAll('.btnTeste')
const tecladoDiv = document.getElementById('teclado');

btnLetras.forEach(btn => {
    var msg = 'letra' + btn.textContent
    btn.addEventListener('touchStart', () => {
        console.log(msg)
        midiOutput.send(msg)
    });
})

// letras.forEach(letra => {
//     const btn = document.createElement('button');
//     btn.textContent = letra;
//     btn.addEventListener('click', () => midiOutput.send(window['mobile' + letra]));
//     tecladoDiv.appendChild(btn);
// });

function alteraPads(array) {
    array.forEach(letra => {
        midiOutput.send(letra);
    })
}