class ModuleConnect {
    private select: Connection;
    private modman: ModuleManager;

    constructor(modman: ModuleManager) {
        this.modman = modman;
        this.select = new Connection(null, null);
    }

    public drawLines()
    {
        $("#lines .portLine").remove();
        const cs: Connection[] = this.modman.getConnections();
        cs.forEach((con: Connection) => this.drawLine(this.getLineFromConnection(con), con.i.getPid()));
    }

    private drawLine(con: Line, pid: number): void
    {
        const linesSVG: JQuery<HTMLElement> = $("#lines");
        const lineElement: JQuery<SVGLineElement> = $(document.createElementNS("http://www.w3.org/2000/svg", "line"));

        lineElement.addClass("portLine");
        lineElement.attr("x1", con.from.x.toString());
        lineElement.attr("y1", con.from.y.toString());
        lineElement.attr("x2", con.to.x.toString());
        lineElement.attr("y2", con.to.y.toString());

        lineElement.attr("data-pid", pid.toString());

        lineElement.on("click", (e: JQuery.ClickEvent) => {
            PortInput.byPID(pid).disconnect();
        });

        linesSVG.append(lineElement);
    }

    private makeConnection(portem: JQuery<HTMLElement>): boolean
    {
        if($(portem).hasClass("moduleInput"))
        {
            if (this.select.i === null)
            {
                const port: PortInput = PortInput.byPID(this.getPIDForElement(portem));
                this.select.i = port;
            }
            else
            {
                if(this.select.i.disconnect())
                {
                    this.select.i = null;
                }
            }
        }
        else if($(portem).hasClass("moduleOutput"))
        {
            if(this.select.o === null)
            {
                const port: PortOutput = PortOutput.byPID(this.getPIDForElement(portem));
                this.select.o = port;
            }
        }
        if(this.select.isMade())
        {
            this.select.connect();
            this.select = new Connection(null, null);
            return true;
        }
        return false;
    }

    public onMouse(e: JQuery.MouseEventBase, module: JQuery<HTMLDivElement>)
    {
        const portem: JQuery<HTMLElement> = ($(e.target));
        if(this.makeConnection(portem) || true)
        {
            this.drawLines();
        }
    }

    private getElementForPort(port: Port): JQuery<HTMLElement>
    {
        let elem: JQuery<HTMLElement> = null;
        const pid: number = port.getPid();
        $(`.module .modulePort.${port.getClasses()}`).each((index: number, elementhtml: HTMLElement) => {
            const portem: JQuery<HTMLElement> = $(elementhtml);
            if(this.getPIDForElement(portem) === pid)
            {
                elem = portem;
            }
        });
        return elem;
    }
    
    private getPIDForElement(portem: JQuery<HTMLElement>): number
    {
        const pid: number = parseInt($(portem).data("pid"));
        return pid;
    }

    private getLineFromConnection(c: Connection): Line //returns {from: {x, y}, to: {x, y}}
    {
        const emOut: JQuery<HTMLElement> = this.getElementForPort(c.o);
        const emIn: JQuery<HTMLElement> = this.getElementForPort(c.i);
        const poso: JQuery.Coordinates = $(emOut).offset();
        const posi: JQuery.Coordinates = $(emIn).offset();
        const scrollTop = $(document).scrollTop();

        return new Line(
            new Pos(
                poso.left + emOut.width(),
                poso.top + emOut.height()/2 - scrollTop
            ),
            new Pos(
                posi.left,
                posi.top + emIn.height()/2 - scrollTop
            )
        );
    }
}