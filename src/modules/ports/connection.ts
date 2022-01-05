class Connection
{
    public i: PortInput;
    public o: PortOutput;

    constructor(o: PortOutput, i: PortInput)
    {
        this.o = o;
        this.i = i;
    }

    public isMade(): boolean
    {
        return this.i != null && this.o != null;
    }

    public connect()
    {
        this.i.setConnection(this.o);
    }

    public disconnect()
    {
        this.i.disconnect();
    }
}