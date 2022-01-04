class ControlRange extends ControlNumeric
{
    private range: {min: number, max: number};

    constructor(label: string, range: {min: number, max: number}, value: number | (() => number) = (range.min + range.max)/2, step: number = 0.0000001, type: string = "range", event: string = "change")
    {
        super(label, "", value, type, event);
        this.range = range;
        this.setAttribute("min", this.range.min);
        this.setAttribute("max", this.range.max);
        this.setAttribute("step", step);
    }

    protected isValueLegal(value: number): boolean
    {
        return value >= this.range.min && value <= this.range.max;
    }

    protected constrainValue(value: number): number
    {
        return Math.max(Math.min(value, this.range.max), this.range.min);
    }
}