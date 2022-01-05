class ControlDecibelRange extends ControlLogRange
{
    constructor(label: string, range: {min: number, max: number}, value: number = (range.min + range.max)/2, step: number = ControlRange.step, decimals: number = ControlNumeric.decimals, type: string = ControlRange.type, event: string = ControlRange.event)
    {
        super(label, {min: range.min, max: range.max}, 10, value, Math.log10, step, decimals, type, event);
        this.addClass("decibelRange");
    }
    
    public processValue(value: number): number
    {
        return 20*super.processValue(value);
    }
    
    public unprocessValue(value: number): number
    {
        return super.unprocessValue(value/20);
    }
}