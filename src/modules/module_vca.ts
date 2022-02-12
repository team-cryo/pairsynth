class ModuleVCA extends ModuleGain implements IModuleCVInSingle
{
    private inputCV: PortInput;

    constructor(gain: number = 1)
    {
        super(gain, "VCA");
        this.inputCV = this.registerInput("CV");
    }

    protected coefficient(timing: timing): number
    {
        return super.coefficient(timing)*this.getCV().getValue(timing);
    }
    
    public getCV(): PortInput
    {
        return this.inputCV;
    }
}