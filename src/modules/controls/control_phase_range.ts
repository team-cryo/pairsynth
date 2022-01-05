class ControlPhaseRange extends ControlRange
{
    constructor(label: string, value: number = 0, step: number = ControlRange.step, decimals: number = 0, type: string = ControlRange.type, event: string = ControlRange.event)
    {
        super(label, {min: -360, max: 360}, value, step, decimals, type, event);
        this.addClass("phaseRange");
    }
}