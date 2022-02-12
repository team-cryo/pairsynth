class ModuleOutput extends Module
{
    private speakerR: PortInput;
    private speakerL: PortInput;

    private masterVolume: ControlRange;
    private stereoSeparation: ControlRange;

    constructor()
    {
        super("Stereo Output");
        this.speakerR = this.registerInput("R");
        this.speakerL = this.registerInput("L");
        this.masterVolume = this.addControl(new ControlRange("Master-Volume", {min: 0, max: 1}, 0.1));
        this.stereoSeparation = this.addControl(new ControlRange("Stereo-Separation", {min: 0, max: 1}, 0.3));
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

    private getAudioOutputMono(timing: timing)
    {
        return (this.speakerR.getValue(timing) + this.speakerL.getValue(timing))/2*this.masterVolume.getValue();
    }

    private getAudioOutputCh(ch: number, timing: timing)
    {
        const inp: PortInput = this.getInput(ch);
        return inp != null ? inp.getValue(timing)*this.masterVolume.getValue() : 0;
    }

    public getAudioOutput(ch: number, timing: timing): number
    {
        const f1: number = this.stereoSeparation.getValue();
        const f2: number = 1 - f1;
        return this.getAudioOutputCh(ch, timing)*f1 + this.getAudioOutputMono(timing)*f2;
    }
}