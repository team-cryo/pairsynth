class ControlNumericInteger extends ControlNumeric
{
    constructor(label: string, placeholder: string = label, value: number | (() => number) = 0, type: string = "numeric", event: string = "change")
    {
        super(label, placeholder, value, type, event);
    }

    protected constrainValue(value: number): number
    {
        return Math.round(value);
    }
}