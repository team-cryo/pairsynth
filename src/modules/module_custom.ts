class ModuleCustom extends Module {
    private out: PortOutput;
    private controlTextbox: ControlTextbox;
    private status: ControlStatus;
    private lastTime: number = 0;

    constructor() {
        super("Custom");
        this.out = this.registerOutput("Out", this.func);
        this.controlTextbox = this.addControl(
            new ControlTextbox("Algo", "Custom algorithm", "Math.random() * 2 - 1"));
        this.status = this.addControl(new ControlStatus("Status"));
    }

    private func(timing: timing)
    {
        const js: string = this.controlTextbox.getValue();

        //som easily avaliable variables for custom module js
        const time: number = timing.time;
        const dt: number = timing.dt(this.lastTime);
        this.lastTime = time;

        try {
            return eval(js);
        } catch (err) {
            this.status.setStatus("Exception in algorithm.");
            this.status.setColor("rgb(255, 55, 95)");
        }
    }
}