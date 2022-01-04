class ControlNumeric extends ControlValue<number, JQuery<HTMLInputElement>>
{
    constructor(label: string, placeholder: string = label, value: number | (() => number) = 0, type: string = "numeric", event: string = "change")
    {
        super(label, placeholder, value, type, event);
    }

    protected getValueFromTarget(element: JQuery<HTMLInputElement>): string
    {
        return element.val() as string;
    }

    protected constrainValue(value: number): number
    {
        return value;
    }

    protected parseValue(str: string): number {
        return parseFloat(str);
    }
    
    protected setValueToTarget(element: JQuery<HTMLInputElement>, value: number): void
    {
        element.val(value);
    }
}