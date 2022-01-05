class ControlTextbox extends ControlValue<string, JQuery<HTMLInputElement>>
{
    constructor(label: string, placeholder: string = label, value: string = "", type: string = "textbox", event: string = "change")
    {
        super(label, placeholder, value, type, event);
    }

    protected getValueFromTarget(element: JQuery<HTMLInputElement>): string
    {
        return element.val() as string;
    }

    protected parseValue(str: string): string {
        return str;
    }
    
    protected setValueToTarget(element: JQuery<HTMLInputElement>, value: string): void
    {
        element.val(value);
    }
    
    protected constrainValue(value: string): string
    {
        return value; //filter characters if needed
    }

    public parseJS() {
        return eval(this.getValue());
    }
}