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
}