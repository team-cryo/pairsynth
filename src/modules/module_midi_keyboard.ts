class ModuleMIDIKeyboard extends Module implements IModuleKeyboardMono
{
    private octaves: number;

    private outputCV: PortOutput;
    private outputGate: PortOutput;

    private controlController: ControlDropdown<MIDIManager.EController>;

    constructor(octaves: number = 10, PDE: number = 12)
    {
        super("MIDI-Keyboard");
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
        return MIDIManager.midman.monoNoteOct(this.controlController.getValue());
    }

    private gate(): boolean
    {
        return MIDIManager.midman.gate(this.controlController.getValue());
    }
}