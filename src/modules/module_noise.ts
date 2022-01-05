class ModuleNoise extends ModuleSource
{
    constructor()
    {
        super("Noise-generator");
    }

    protected wave(): number
    {
        return Math.random()*2 - 1;
    }
}