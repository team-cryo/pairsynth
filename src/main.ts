/**
 * Module manager is a type of manager of objects that is supposed to manage active 
 * synth-modules in the system.
 *
 */

const modman: ModuleManager = new ModuleManager();
const midman: MIDIManager = new MIDIManager();

//const lfo1: ModuleOsc = modman.addModule(new ModuleOsc(Waveform.sawtooth, new DistributionRange(0.546, 95.4)));
//const lfo2: ModuleOsc = modman.addModule(new ModuleOsc(Waveform.square, new DistributionRange(0.454, 78)));
const midi: ModuleMIDIKeyboard = modman.addModule(new ModuleMIDIKeyboard(midman));
const noise: ModuleNoise = modman.addModule(new ModuleNoise());
const oscillator: ModuleOsc = modman.addModule(new ModuleOsc(Waveform.square));
const vca: ModuleVCA = modman.addModule(new ModuleVCA());
const custom: ModuleCustom = modman.addModule(new ModuleCustom());
/*oscillator.getCV().setConnection(midi.getCV());
vca.getCV().setConnection(midi.getGate());
vca.getInput().setConnection(oscillator.getOutput());*/
//modman.getOutput(0).setConnection(vca.getOutput());
modman.getOutput(0).setConnection(oscillator.getOutput());

//modman.getOutput(0).setConnection(custom.getRegisteredOutputs()[0]);

const audiowoman: AudioManager = new AudioManager();
const toolbarMenu = new ToolbarMenu();
const modcon: ModuleConnect = new ModuleConnect(modman);
const modrend = new ModuleRenderer(modcon);
const modmidi = new ModuleMidiView();

const contextMenu = new ContextMenu(audiowoman, modman, modrend);
modrend.loadModules(modman.allModules());
modrend.renderModules(modman);
modcon.drawLines();

$(".btnPlay").on("click", () =>
{
    audiowoman.play(modman);
});

$(".btnStop").on("click", () =>
{
    audiowoman.pause();
});