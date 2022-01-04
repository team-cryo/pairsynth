class ModuleVCA extends ModuleGain implements IModuleCVInSingle
{
    private inputCV: PortInput;

    constructor(gain: number = 1)
    {
        super(gain, "VCA");
        this.inputCV = this.registerInput("CV");
    }

    protected coefficient(time: number): number
    {
        return super.coefficient(time)*this.getCV().getValue(time);
    }
    
    public getCV(): PortInput
    {
        return this.inputCV;
    }
}