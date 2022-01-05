class ModuleGain extends ModuleTransfer
{
    private controlGain: ControlRange;

    constructor(gain: number = 1, name: string = "Gain")
    {
        super(name);
        this.controlGain = this.addControl(new ControlRange("Gain", {min: 0, max: 1}, gain));
    }

    protected coefficient(): number
    {
        return this.controlGain.getValue();
    }

    protected transferFunction(value: number): number
    {
        return value*this.coefficient();
    }
}