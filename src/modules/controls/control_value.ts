class ControlValue<TypeValue, TypeHTMLElement extends JQuery<any> = JQuery<HTMLElement>> extends Control
{
    constructor(label: string, placeholder: string = label, value: TypeValue | (() => TypeValue), type: string, event: string = "change")
    {
        super(label, type);
        this.setAttribute("value", value);
        this.setAttribute("placeholder", label);
        this.addEvent(".controlInput", event, this._onChange);
    }

    private _onChange(e: JQuery.ChangeEvent): boolean
    {
        const target: TypeHTMLElement = $(e.target) as TypeHTMLElement;
        const value: TypeValue = this.parseValue(this.getValueFromTarget(target));
        if(!this.isValueLegal(value))
        {
            this.setValueToTarget(target, this.constrainValue(value));
            return this.illegalValueCallback(e, value);
        }
        this.setAttribute("value", value);
        return this.onChange(e, value);
    }

    protected isValueLegal(value: TypeValue): boolean
    {
        return this.constrainValue(value) === value;
    }

    protected getValueFromTarget(element: TypeHTMLElement): string
    {
        throw "getValueFromTarget must be extended";
    }

    protected parseValue(str: string): TypeValue
    {
        throw "parseValue must be extended";
    }
    
    protected setValueToTarget(element: TypeHTMLElement, value: TypeValue): void
    {
        throw "setValueToTarget must be extended";
    }

    protected constrainValue(value: TypeValue): TypeValue
    {
        return value;
    }

    protected illegalValueCallback(e: JQuery.ChangeEvent, value: TypeValue): boolean
    {
        return false;
    }

    /**
     * Return false to interrupt
     */
    protected onChange(e: JQuery.ChangeEvent, value: TypeValue)
    {
        return true;
    }

    public getValue(): TypeValue
    {
        return this.getAttribute("value");
    }
}