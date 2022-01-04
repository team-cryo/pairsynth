class ModuleNoise extends ModuleSource
{
    constructor()
    {
        super("Noise-generator");
    }

    protected wave(time: number): number
    {
        return Math.random()*2 - 1;
    }
}