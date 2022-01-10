class ControlValue<TypeValue, TypeHTMLElement extends JQuery<any> = JQuery<HTMLElement>> extends Control
{
    protected bufLastChange: number = -1;
    private bufChange: number = 0;
    protected valueLastChange: TypeValue;

    constructor(label: string, placeholder: string = label, value: TypeValue, type: string, event: string = "change")
    {
        super(label, type);
        this.valueLastChange = value;
        this.setAttribute("value", value);
        this.setAttribute("placeholder", label);
        this.addEvent(".controlInput", event, this._onChange);
    }

    private _onChange(e: JQuery.ChangeEvent): boolean
    {
        const target: TypeHTMLElement = $(e.target) as TypeHTMLElement;
        const oldValue: TypeValue = this.getAttribute("value");
        const value: TypeValue = this.parseValue(this.getValueFromTarget(target));
        if(value === undefined)
        {
            throw "sum ting wong: undefined value";
        }
        if(oldValue === value)
        {
            return true;
        }
        this.valueLastChange = oldValue;
        this.bufLastChange = this.bufChange;
        this.bufChange = AudioManager.audiowoman.timing.buf;
        if(!this.isValueLegal(value))
        {
            const cvalue: TypeValue = this.constrainValue(value);
            if(this.isValueLegal(cvalue))
            {
                this.setValueToTarget(target, cvalue);
            }
            return this.illegalValueCallback(e, value);
        }
        if(this.setAttribute("value", value))
        {
            if(this.module != null)
            {
                this.module.onTweak(this, value);
            }
            this.updateDisplayValue(e);
            return this.onChange(e, value);
        }
        return true;
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
    public onChange(e: JQuery.ChangeEvent, value: TypeValue): boolean
    {
        return true;
    }

    public processValue(value: TypeValue): TypeValue
    {
        return value;
    }

    public unprocessValue(value: TypeValue): TypeValue
    {
        return value;
    }

    protected displayValue(): string
    {
        return this.processValue(this.getValue()).toString();
    }

    private updateDisplayValue(element: JQuery.ChangeEvent): void
    {
        $(element.target).closest(".controlListElement").find(".controlDisplayValue").html(this.displayValue());
    }

    public getValue(): TypeValue
    {
        return this.getAttribute("value");
    }
}