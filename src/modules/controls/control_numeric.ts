class ControlNumeric extends ControlValue<number, JQuery<HTMLInputElement>>
{
    public static decimals: number = 2;

    private decimalCoefficient: number;
    private range: {min: number, max: number};

    constructor(label: string, placeholder: string = label, range: {min: number, max: number}, value: number = 0, decimals: number = ControlNumeric.decimals, type: string = "numeric", event: string = "change")
    {
        super(label, placeholder, value, type, event);
        this.range = range;
        this.setAttribute("min", this.range.min);
        this.setAttribute("max", this.range.max);
        this.decimalCoefficient = 10**decimals;
    }

    protected getValueFromTarget(element: JQuery<HTMLInputElement>): string
    {
        return element.val() as string;
    }

    protected isValueLegal(value: number): boolean
    {
        return !isNaN(value) && value >= this.range.min && value <= this.range.max;
    }

    protected constrainValue(value: number): number
    {
        return Math.max(Math.min(value, this.range.max), this.range.min);
    }

    protected parseValue(str: string): number {
        return parseFloat(str);
    }
    
    protected setValueToTarget(element: JQuery<HTMLInputElement>, value: number): void
    {
        if(isNaN(value))
        {
            throw "value cannot be NaN";
        }
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