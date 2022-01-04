class ModuleOutput extends Module
{
    private speakerR: PortInput;
    private speakerL: PortInput;

    private masterVolume: ControlRange;

    constructor()
    {
        super("Stereo Output");
        this.speakerR = this.registerInput("R");
        this.speakerL = this.registerInput("L");
        this.masterVolume = new ControlRange("Master Volume", {min: 0, max: 1}, 0.1);
    }

    public getInput(ch: number): PortInput
    {
        switch(ch)
        {
            case 0: return this.speakerR;
            case 1: return this.speakerL;
        }
        return null;
    }

    public getAudioOutput(ch: number, time: number): number
    {
        const i: PortInput = this.getInput(ch);
        return i != null ? i.getValue(time)*this.masterVolume.getValue() : 0;
    }
}