class ControlRange extends ControlNumeric
{
    protected static step = 0.001;
    protected static type = "range";
    protected static event = "input";

    constructor(label: string, range: {min: number, max: number}, value: number = (range.min + range.max)/2, step: number = ControlRange.step, decimals: number = ControlNumeric.decimals, type: string = ControlRange.type, event: string = ControlRange.event)
    {
        super(label, "", range, value, decimals, type, event);
        this.setAttribute("step", step);
    }

    public getValue(): number
    {
        const val = super.getValue();
        const timing: timing = AudioManager.audiowoman.timing;
        if(timing.buf === this.bufLastChange + 1)
        {
            const f1 = timing.cycle;
            const f2 = 1 - f1;
            return val*f1 + this.valueLastChange*f2;
        }
        return val;
    }
}