class Waveform {
    static sine: Waveform = new Waveform(Math.cos, "Sine");
    static square: Waveform = new Waveform((theta: number) => (theta < Math.PI ? -1 : 1), "Square");
    static sawtooth: Waveform = new Waveform((theta: number) => (theta/Math.PI - 1), "Sawtooth");
    static triangle: Waveform = new Waveform((theta: number) => (1 - Math.abs(Waveform.sawtooth.func(theta))*2), "Triangle");

    private func: Function;
    public name: string;

    constructor(func: Function, name: string = "") {
        this.func = func;
        this.name = name;
    }

    /**
    * @param float theta
    */
    getWave(theta: number)
    {
        theta = theta % (2*Math.PI);
        return this.func(theta);
    }
}