class ModuleMIDIKeyboard extends Module implements IModuleKeyboardMono
{
    private static mid: number = 0;
    private mid: number;
    private midman: MIDIManager;
    private octaves: number;

    private outputCV: PortOutput;
    private outputGate: PortOutput;

    private controlController: ControlDropdown<MIDIManager.EController>;

    constructor(midman: MIDIManager, octaves: number = 10)
    {
        super("MIDI-Keyboard");
        this.midman = midman;
        this.controlController = this.addControl(new ControlDropdown("MIDI-Controller", "None", MIDIManager.EController, MIDIManager.EController.Keyboard))
        this.outputCV = this.registerOutput("CV", this.valueCV);
        this.outputGate = this.registerOutput("Gate", this.valueGate);
    }
    public getGate(): PortOutput
    {
        return this.outputGate;
    }
    public getCV(): PortOutput
    {
        return this.outputCV;
    }

    private valueCV(): number
    {
        return 2*this.noteOct()/this.octaves;
    }
    
    private valueGate() : number
    {
        return this.gate() ? 1 : 0;
    }

    private noteOct(): number
    {
        return this.midman.monoNoteOct(this.controlController.getValue());
    }

    private gate(): boolean
    {
        return this.midman.gate(this.controlController.getValue());
    }
}