class ControlFrequencyRange extends ControlLogRange
{
    constructor(label: string, range: {min: number, max: number}, value: number = (range.min + range.max)/2, step: number = ControlRange.step, decimals: number = ControlNumeric.decimals, type: string = ControlRange.type, event: string = ControlRange.event)
    {
        super(label, {min: range.min, max: range.max}, 2, value, Math.log2, step, decimals, type, event);
        this.addClass("freqRange");
    }
}