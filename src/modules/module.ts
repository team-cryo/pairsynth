class Module implements IModule
{
    private static moduleIndex: number = 0;

    public pos: {x: number, y: number};

    public index: number;
    public name: string;
    public template: string;
    private registeredInputs: PortInput[];
    private registeredOutputs: PortOutput[];
    private controls: Control[];

    constructor(name: string) {
        this.index = Module.moduleIndex++;
        this.name = name;

        this.registeredInputs = [];
        this.registeredOutputs = [];
        this.controls = [];
    }

    protected registerInput(label: string): PortInput
    {
        const port: PortInput = new PortInput(label);
        this.registeredInputs.push(port);
        port.module = this;
        return port;
    }
    public getRegisteredInputs()
    {
        return this.registeredInputs;
    }
    
    protected registerOutput(label: string, func: (() => number) = (() => 0)): PortOutput
    {
        const port: PortOutput = new PortOutput(label, func);
        this.registeredOutputs.push(port);
        port.module = this;
        return port;
    }
    public getRegisteredOutputs()
    {
        return this.registeredOutputs;
    }

    public getHTML(): string
    {
        return Mustache.render($("#template-module").html(), {
            "index": this.index,
            "name": this.name,
            "controls": this.getControlsHTML()
        });
    }

    protected addControl<Type extends Control>(control: Type): Type
    {
        this.controls.push(control);
        control.module = this;
        return control;
    }

    public getControlsHTML(): string
    {
        var s: string = "";
        this.controls.forEach((control: Control, i: number) => {
            s += control.getHTML();
        });
        return s;
    }

    public attachEvents(element: JQuery<HTMLDivElement>): void
    {
        this.controls.forEach((control: Control, i: number) => {
            control.attachEvents($(element.find(".controlInput")[i]));
        });
    }

    public onTweak<TypeValue>(control: ControlValue<TypeValue>, value: TypeValue)
    {
        AudioManager.audiowoman.refresh();
    }
}