class ControlLogRange extends ControlRange
{
    private log: (num: number) => number;
    private base: number;

    constructor(label: string, range: {min: number, max: number}, base: number, value: number = (range.min + range.max)/2, log: ((num: number) => number) = ((num: number) => Math.log(num)/Math.log(base)), step: number = ControlRange.step, decimals: number = ControlNumeric.decimals, type: string = ControlRange.type, event: string = ControlRange.event)
    {
        super(label, range, value, step, decimals, type, event);
        this.log = log;
        this.base = base;
    }
    
    public processValue(value: number): number
    {
        return this.base**value;
    }
    
    public unprocessValue(value: number): number
    {
        return this.log(value);
    }
}