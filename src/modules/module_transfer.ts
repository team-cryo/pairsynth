class ModuleTransfer extends Module implements IModuleOutputSingle, IModuleInputSingle
{
    private input: PortInput;
    private output: PortOutput;

    constructor(name: string = "Transfer-Function")
    {
        super(name);
        this.input = this.registerInput("In");
        this.output = this.registerOutput("Out", () => {return this.transferFunction.apply(this, [this.input.getValue(), AudioManager.audiowoman.timing.dt])});
    }
    getOutput(): PortOutput
    {
        return this.output;
    }
    getInput(): PortInput
    {
        return this.input;
    }

    protected transferFunction(value: number, dt: number)
    {
        throw "transferFunction must be extended";
    }
}