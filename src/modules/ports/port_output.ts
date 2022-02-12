class PortOutput extends Port
{
    private static map: PortOutput[] = [];
    private static pid: number = 0;

    private func: (timing: timing) => number;

    constructor(label: string, func: (timing: timing) => number) {
        super(PortOutput.pid++, label);
        PortOutput.map[this.getPid()] = this;
        this.setFunction(func);
    }

    public getValue(timing: timing): number {
        return Math.max(Math.min(this.func.call(this, timing), 1), -1);
    }
    
    public setFunction(func: (timing: timing) => number) {
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

    public getClasses(): string
    {
        return "moduleOutput";
    }
}