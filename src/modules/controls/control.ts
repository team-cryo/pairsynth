class Control implements IHTMLable
{
    private static cid: number;
    private cid: number;

    public module: Module;
    private label: string;
    private classu: string;
    protected type: string;
    private attributes: {[attribute: string]: any};
    private events: {[target: string]: {[event: string]: ((e: Event) => boolean) | ((e: Event) => void)}};

    constructor(label: string, type: string)
    {
        this.cid = Control.cid++;
        this.label = label;
        this.classu = "";
        this.type = type;
        this.attributes = {};
        this.events = {};
    }

    protected addClass(cl: string): void
    {
        this.classu = this.classu.length <= 0 ? cl : (this.classu + " " + cl);
    }

    protected setAttribute(attribute: string, value: any): boolean
    {
        if(this.attributes[attribute] != value)
        {
            this.attributes[attribute] = value;
            return true;
        }
        return false;
    }

    protected getAttribute(attribute: string)
    {
        const value: any = this.attributes[attribute];
        return value instanceof Function ? value() : value;
    }

    protected getAttributes()
    {
        return _.each(this.attributes, (value: any) => value instanceof Function ? value() : value);
    }

    protected getCID()
    {
        return this.cid;
    }

    private getContentHTML(): string
    {
        return Mustache.render($(`#template-control-${this.type}`).html(), this.getAttributes()).replace(/\s+/g, " ").trim();
    }

    public getHTML(): string
    {
        return Mustache.render($("#template-listelement-controls").html(), {
            "label": this.label,
            "classes": this.classu,
            "content": this.getContentHTML()
        }).replace(/\s+/g, " ").trim();
    }

    public addEvent(target: string, event: string, callback: ((e: any) => boolean) | ((e: any) => void)): void
    {
        if(!_.has(this.events, target))
        {
            this.events[target] = {};
        }
        this.events[target][event] = (e: Event) => callback.call(this, e);
    }

    public attachEvents(element: JQuery<HTMLElement>): void
    {
        _.each(this.events, (eventsToTarget: {[event: string]: ((e: Event) => boolean) | ((e: Event) => void)}, target: string) =>
        {
            _.each(eventsToTarget, (callback: ((e: Event) => boolean) | ((e: Event) => void), event: string) =>
            {
                const t = (target.length > 0 ? element.closest(target) : element)
                t.on(event, callback);
                t.trigger(event);
            });
        });
    }
}