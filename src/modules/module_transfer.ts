class ModuleTransfer extends Module implements IModuleOutputSingle, IModuleInputSingle
{
    private input: PortInput;
    private output: PortOutput;

    constructor(name: string = "Transfer-Function")
    {
        super(name);
        this.input = this.registerInput("In");
        this.output = this.registerOutput("Out", (timing: timing) => this.transferFunction(this.input.getValue(timing), timing));
    }
    public getOutput(): PortOutput
    {
        return this.output;
    }
    public getInput(): PortInput
    {
        return this.input;
    }

    protected transferFunction(value: number, timing: timing): number
    {
        throw "transferFunction must be extended";
    }
}