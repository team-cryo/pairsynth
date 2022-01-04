class ModuleSource extends Module implements IModuleOutputSingle
{
    private output: PortOutput;

    private amplitude: ControlRange;

    constructor(name: string, amplitude: number = 1) {
        super(name);
        this.amplitude = this.addControl(new ControlRange("Amplitude", {min: 0, max: 1}, amplitude));
        this.output = this.registerOutput("Out", (time: number) => {return this.signal.apply(this, [time])});
    }

    private signal(time: number): number
    {
        return this.wave(time)*this.amplitude.getValue();
    }

    protected wave(time: number): number
    {
        throw "wave must be extended";
    }

    public getOutput()
    {
        return this.output;
    }
}