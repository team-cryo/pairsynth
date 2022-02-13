/**
 * Module manager is a type of manager of objects that is supposed to manage active 
 * synth-modules in the system.
 *
 */

const modman: ModuleManager = new ModuleManager();
const midman: MIDIManager = new MIDIManager();

//const lfo1: ModuleOsc = modman.addModule(new ModuleOsc(Waveform.sine, ModuleOsc.rangeLFO, ModuleOsc.rangeLFO));
//const lfo2: ModuleOsc = modman.addModule(new ModuleOsc(Waveform.sine, ModuleOsc.rangeLFO, ModuleOsc.rangeLFO));
//const lfo3: ModuleOsc = modman.addModule(new ModuleOsc(Waveform.sine, ModuleOsc.rangeLFO, ModuleOsc.rangeLFO));
//const midi: ModuleMIDIKeyboard = modman.addModule(new ModuleMIDIKeyboard(midman));
//const noise: ModuleNoise = modman.addModule(new ModuleNoise());
const oscillator: ModuleOsc = modman.addModule(new ModuleOsc(Waveform.sine));
//const vca: ModuleVCA = modman.addModule(new ModuleVCA());
//const custom: ModuleCustom = modman.addModule(new ModuleCustom());

/*oscillator.getCV().setConnection(midi.getCV());
vca.getCV().setConnection(midi.getGate());
vca.getInput().setConnection(oscillator.getOutput());*/
//modman.getOutput(0).setConnection(vca.getOutput());

//lfo1.getCV().setConnection(lfo2.getOutput());
//lfo2.getCV().setConnection(lfo3.getOutput());
//oscillator.getCV().setConnection(lfo1.getOutput());
modman.getOutputPort(0).setConnection(oscillator.getOutput());

new Oscilloscope("oscilloscope", "sine").toChart();

//modman.getOutput(0).setConnection(custom.getRegisteredOutputs()[0]);

const audiowoman: AudioManager = new AudioManager();
const toolbarMenu = new ToolbarMenu();
const modcon: ModuleConnect = new ModuleConnect(modman);
const modrend = new ModuleRenderer(modcon);
const modmidi = new ModuleMidiView();

const contextMenu = new ContextMenu();
modrend.renderModules();
modcon.drawLines();

$(".btnPlay").on("click", () =>
{
    audiowoman.play();
});

$(".btnStop").on("click", () =>
{
    audiowoman.pause();
});

$(".btnReset").on("click", () =>
{
    audiowoman.reset();
})