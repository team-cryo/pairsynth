class ModuleVCA extends ModuleGain implements IModuleCVInSingle
{
    private inputCV: PortInput;

    constructor(gain: number = 1)
    {
        super(gain, "VCA");
        this.inputCV = this.registerInput("CV");
    }

    protected coefficient(): number
    {
        return super.coefficient()*this.getCV().getValue();
    }
    
    public getCV(): PortInput
    {
        return this.inputCV;
    }
}