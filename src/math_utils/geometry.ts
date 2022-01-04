class Line
{
    public from: Pos;
    public to: Pos;

    constructor(from: Pos, to: Pos)
    {
        this.from = from;
        this.to = to;
    }

    public abs2(): number
    {
        return (this.from.x - this.to.x)**2 + (this.from.y - this.to.y)**2
    }

    public abs(): number
    {
        return Math.sqrt(this.abs2());
    }

    public theta(): number
    {
        var dx: number = this.to.x - this.from.x;
        var dy: number = this.to.y - this.from.y;
        var theta: number = Math.atan2(dx, dy);

        if(dx < 0)
        {
            theta = theta - Math.sign(theta - Math.PI)*Math.PI;
        }

        return theta;
    }

    public center(): Pos
    {
        return new Pos((this.to.x + this.from.x)/2, (this.to.y + this.from.y)/2);
    }

    public height(): number
    {
        return Math.abs(this.from.y - this.to.y);
    }
    
    public width(): number
    {
        return Math.abs(this.from.x - this.to.x);
    }

    public pos(): Pos
    {
        const c = this.center();
        return new Pos(c.x - this.width()/2, c.y - this.height()/2)
    }
}

class Pos
{
    public x: number;
    public y: number;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }
}