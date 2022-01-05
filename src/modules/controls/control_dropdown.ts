class ControlDropdown<Enum> extends ControlNumeric
{
    private options: string[];

    constructor(label: string, placeholder: string = "None", enumeration: {[name: string]: (number | any)}, value: number = -1, type: string = "dropdown", event: string = "change")
    {
        super(label, placeholder, value, 0, type, event);
        this.options = [];
        
        this.options = Object.keys(enumeration).filter((x: string) => (typeof enumeration[x] === "number"));
        this.setAttribute("options", this.getOptionHTML());
    }

    protected constrainValue(value: number): number
    {
        if(!_.has(Object.keys(this.options), value))
        {
            return -1;
        }
        return value;
    }

    private getOptionHTML()
    {
        let s = "";
        this.options.forEach((label: string, value: number) =>
        {
            s += Mustache.render($(`#template-control-${this.type}-selectvalue`).html(), {
                "label": label,
                "value": value
            });
        });
        return s;
    }
}