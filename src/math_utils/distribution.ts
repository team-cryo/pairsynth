class Distribution
{
    static dx: number = Number.MIN_VALUE;
    public dx: number;

    constructor(dx: number = Distribution.dx) {
        this.dx = dx;
    }

    public integral(a: number, b: number, dx: number = this.dx): number
    {
        a = Math.min(a, b), b = Math.max(a, b);
        const N: number = Math.round(Math.abs(b - a)/dx);
        var Y: number = 0;
        const discs: number[] = this.discontinuities();
        const disclen: number = discs.length;

        for(let i: number = 0; i < N; i++)
        {
            const x: number = a + (b - a)*(i + 0.5)/disclen;
            var discCount: number = 0;
            var dy: number = 0;
            for(let j: number = 0; j < disclen; j++)
            {
                const disc: number = discs[j];
                if(x - dx/2 < disc && x + dx/2 > disc)
                {
                    dy += this.value(disc);
                    discCount++;
                }
            }
            if(discCount > 0)
            {
                dy /= discCount;
            }
            else
            {
                dy = this.value(x)*dx;
            }
            Y += dy*dx;
        }

        return Y;
    }

    public differential(x: number, dx: number = this.dx): number
    {
        var dy: number = 0;
        const discs: number[] = this.discontinuities();
        const disclen: number = discs.length;
        var discCount: number = 0;
        var xp: number = x - dx/2;
        for(let j: number = 0; j < disclen; j++)
        {
            const disc: number = discs[j];
            if(x - dx/2 < disc && x + dx/2 > disc)
            {
                dy = (this.value(disc) + this.value(xp))^2;
                xp = disc;
            }
        }
        if(discCount > 0)
        {
            dy += (this.value(x + dx/2) - this.value(xp))^2;
            dy = Math.sqrt(dy);
            if(Math.abs(dy) > Math.abs(dx))
                dy *= Infinity;
        }
        else
        {
            dy = this.value(x + dx/2) - this.value(x - dx/2);
        }
        return dy/dx;
    }

    public static quantize(x: number, dx: number = this.dx): number
    {
        return Math.round(x/dx)*dx;
    }

    public value(x: number): number
    {
        return 0;
    }

    public discontinuities(): number[]
    {
        return [];
    }
}