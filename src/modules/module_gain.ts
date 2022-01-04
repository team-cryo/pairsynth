class ModuleGain extends ModuleTransfer
{
    private controlGain: ControlRange;

    constructor(gain: number = 1, name: string = "Gain")
    {
        super(name);
        this.controlGain = this.addControl(new ControlRange("Gain", {min: 0, max: 1}, gain));
    }

    protected coefficient(time: number): number
    {
        return this.controlGain.getValue();
    }

    protected transferFunction(value: number, time: number): number
    {
        return value*this.coefficient(time);
    }
}