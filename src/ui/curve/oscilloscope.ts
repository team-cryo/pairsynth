class Oscilloscope extends Curve
{
    constructor(id: string, label: string)
    {
        super(id, "line", label);
    }
    
    protected override getValues(): number[]
    {
        const resolution = 1024;
        const T = 1/220;
        const f = 1760;
        return Array.apply(null, Array(resolution)).map((x: number, i: number) => {
            const t = (2*i/(resolution - 1) - 1)*T;
            return Math.sin(Math.PI*t*f);
        });
    }
}