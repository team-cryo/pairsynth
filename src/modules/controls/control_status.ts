class ControlStatus extends Control {
    constructor(label: string) {
        super(label, "status");
    }

    public setStatus(status: string) {
        this.setAttribute("status", status);
    }

    public setColor(color: string) {
        this.setAttribute("color", color);
    }
}