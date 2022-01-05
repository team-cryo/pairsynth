class PortOutput extends Port
{
    private static map: PortOutput[] = [];
    private static pid: number = 0;

    private func: () => number;

    constructor(label: string, func: () => number) {
        super(PortOutput.pid++, label);
        PortOutput.map[this.getPid()] = this;
        this.setFunction(func);
    }

    public getValue(): number {
        return Math.max(Math.min(this.func.call(this), 1), -1);
    }
    
    public setFunction(func: () => number) {
        this.func = func;
    }
    
    public static byPID(pid: number)
    {
        if(pid < PortOutput.map.length)
        {
            return PortOutput.map[pid];
        }
        return null;
    }
}