class ModuleOsc extends ModuleSource implements IModuleCVInSingle
{
    public static rangeHearing: range = {min: 20, max: 20000}; //human hearing range
    public static rangePiano: range = {center: 440*(2**(3/12)), octaves: 3} // from 3 octaves up and down from C4
    public static rangeLFO: range = {down: 10, max: 20}; //from 20Hz and 12 octaves down

    public theta: number;
    protected time: number;

    private waveform: Waveform;
    private inputCV: PortInput;
    
    public controlCenterFreq: ControlRange;
    public controlOctaveRange: ControlRange;
    public controlPhi: ControlRange;

    constructor(waveform: Waveform, freq: number | range = ModuleOsc.rangePiano, range: range = ModuleOsc.rangeHearing, phi: number = 0)
    {
        super(waveform.name + (waveform.name != "" ? " " : "") + "Oscillator");

        this.controlCenterFreq = this.addControl(new ControlFrequencyRange("Center", {min: rangeMinLog2(range), max: rangeMaxLog2(range)}, rangeCenterLog2(freq)));
        this.controlOctaveRange = this.addControl(new ControlRange("Range", {min: 0, max: rangeOctaves(range)}, rangeOctaves(freq)));
        this.controlPhi = this.addControl(new ControlRange("Phi", {min: -360, max: 360}, (phi*180/Math.PI)));
        this.theta = 0;
        this.waveform = waveform;
        this.inputCV = this.registerInput("CV");
    }

    protected getPhi()
    {
        return this.controlPhi.getValue()*Math.PI/180 + 2*Math.PI
    }

    protected wave(dt: number): number
    {
        const freq = this.getFreq();
        this.theta = (this.theta + 2*Math.PI*dt*freq)%(2*Math.PI);
        const w = this.waveform.getWave(this.getPhi() + this.theta);
        return w;
    }

    public getFreq(): number
    {
        const x: number = this.inputCV.getValue();
        const cf: number = this.controlCenterFreq.getValue();
        return 2**(cf + this.controlOctaveRange.getValue()*x);
    }

    public getCV()
    {
        return this.inputCV;
    }

    protected renderTemplate()
    {
        return $("#template-module-osc").html();
    }
}