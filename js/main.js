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