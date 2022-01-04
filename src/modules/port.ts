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

    getPid()
    {
        return this.pid;
    }

    getValue(time: number)
    {
        return 0;
    }

    getLabel()
    {
        return this.label;
    }
}