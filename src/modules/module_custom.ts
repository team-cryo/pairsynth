class ModuleCustom extends Module {
    private out: PortOutput;
    private controlTextbox: ControlTextbox;
    private status: ControlStatus;

    constructor() {
        super("Custom");
        this.out = this.registerOutput("Out", this.func);
        this.controlTextbox = this.addControl(
            new ControlTextbox("Algo", "Custom algorithm", "Math.random() * 2 - 1"));
        this.status = this.addControl(new ControlStatus("Status"));
    }

    private func()
    {
        const js: string = this.controlTextbox.getValue();

        //som easily avaliable variables for custom module js
        const time: number = AudioManager.timing.time;
        const dt: number = AudioManager.timing.dt;

        try {
            return eval(js);
        } catch (err) {
            this.status.setStatus("Exception in algorithm.");
            this.status.setColor("rgb(255, 55, 95)");
        }
    }
}