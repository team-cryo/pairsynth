class ControlNumericInteger extends ControlNumeric
{
    constructor(label: string, placeholder: string = label, value: number = 0, type: string = "numeric", event: string = "change")
    {
        super(label, placeholder, value, 0, type, event);
    }

    protected constrainValue(value: number): number
    {
        return Math.round(value);
    }
}