class Port
{
    private pid: number;
    private label: string;
    public module: Module; 

    constructor(pid: number, label: string)
    {
        this.pid = pid;
        this.label = label;
    }

    public getPid()
    {
        return this.pid;
    }

    public getValue()
    {
        throw "getValue must be extended";
    }

    public getLabel()
    {
        return this.label;
    }
}