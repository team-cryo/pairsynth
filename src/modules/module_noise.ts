class ModuleNoise extends ModuleSource
{
    private readonly seed: number;

    constructor(seed: number = Math.random()*Number.MAX_SAFE_INTEGER)
    {
        super("Noise-generator");
        this.seed = seed;
    }

    private pseudoRandom(tick: number): number
    {
        let value = this.seed;
        for(let i = 0; i < tick; i++)
        {
            value = value * 16807 % 2147483647
            return value;
        }
    }

    protected wave(timing: timing): number
    {
        return this.pseudoRandom(timing.tick)*2 - 1;
    }
}