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

    getValue(time: number): number {
        if(this.connectedTo === null)
            return 0;
        return this.connectedTo.getValue(time);
    }

    setConnection(connectedTo: PortOutput) {
        this.connectedTo = connectedTo;
    }

    getConnection(): Connection
    {
        return this.connectedTo != null ? new Connection(this.connectedTo, this) : null;
    }

    disconnect()
    {
        if(this.getConnection() != null)
        {
            this.setConnection(null);
            return true;
        }
        return false;
    }
    
    static byPID(pid: number)
    {
        if(pid < PortInput.map.length)
        {
            return PortInput.map[pid];
        }
        return null;
    }
}