class PortInput extends Port
{
    private static map: PortInput[] = [];
    private static pid: number = 0;
    public invulnerable: boolean;

    private connectedTo: PortOutput;

    constructor(label: string, connectedTo: PortOutput = null) {
        super(PortInput.pid++, label);
        PortInput.map[this.getPid()] = this;
        this.connectedTo = connectedTo;
    }

    public getValue(): number {
        if(this.connectedTo === null)
            return 0;
        return this.connectedTo.getValue();
    }

    public setConnection(connectedTo: PortOutput) {
        this.connectedTo = connectedTo;
    }

    public getConnection(): Connection
    {
        return this.connectedTo != null ? new Connection(this.connectedTo, this) : null;
    }

    public disconnect()
    {
        if(this.getConnection() != null)
        {
            this.setConnection(null);
            return true;
        }
        return false;
    }
    
    public static byPID(pid: number)
    {
        if(pid < PortInput.map.length)
        {
            return PortInput.map[pid];
        }
        return null;
    }
}