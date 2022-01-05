class ControlNumeric extends ControlValue<number, JQuery<HTMLInputElement>>
{
    public static decimals: number = 2;

    private decimalCoefficient: number;

    constructor(label: string, placeholder: string = label, value: number = 0, decimals: number = ControlNumeric.decimals, type: string = "numeric", event: string = "change")
    {
        super(label, placeholder, value, type, event);
        this.decimalCoefficient = 10**decimals;
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

    protected displayNumber(): number
    {
        return this.getValue();
    }

    protected displayValue(): string
    {
        return (Math.round(this.displayNumber()*this.decimalCoefficient)/this.decimalCoefficient).toString();
    }
}