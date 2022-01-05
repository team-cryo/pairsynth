class ModuleSource extends Module implements IModuleOutputSingle
{
    private output: PortOutput;

    private amplitude: ControlRange;

    constructor(name: string, amplitude: number = 1) {
        super(name);
        this.amplitude = this.addControl(new ControlRange("Amplitude", {min: 0, max: 1}, amplitude));
        this.output = this.registerOutput("Out", () => {return this.signal.apply(this)});
    }

    private signal(): number
    {
        return this.wave(AudioManager.timing.dt)*this.amplitude.getValue();
    }

    protected wave(dt: number): number
    {
        throw "wave must be extended";
    }

    public getOutput()
    {
        return this.output;
    }
}