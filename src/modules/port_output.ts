class PortOutput extends Port
{
    private static map: PortOutput[] = [];
    private static pid: number = 0;

    private func: Function;

    constructor(label: string, func: Function) {
        super(PortOutput.pid++, label);
        PortOutput.map[this.getPid()] = this;
        this.func = func;
    }

    getValue(time: number): number {
        return Math.max(Math.min(this.func.call(this, [time]), 1), -1);
    }
    
    setFunction(func: Function) {
        this.func = func;
    }
    
    static byPID(pid: number)
    {
        if(pid < PortOutput.map.length)
        {
            return PortOutput.map[pid];
        }
        return null;
    }
}