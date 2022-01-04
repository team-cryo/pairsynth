class ModuleCustom extends Module {
    private out: PortOutput;

    constructor() {
        super("Custom");
        this.out = this.registerOutput("Out", this.func);
    }

    private func(time: number)
    {
        
    }
}