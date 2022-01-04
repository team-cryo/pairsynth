class Control implements IHTMLable
{
    private label: string;
    private clas: string;
    protected type: string;
    private attributes: {[attribute: string]: any};
    private events: {[target: string]: {[event: string]: ((e: Event) => boolean) | ((e: Event) => void)}};

    constructor(label: string, type: string)
    {
        this.label = label;
        this.clas = "";
        this.type = type;
        this.attributes = {};
        this.events = {};
    }

    protected addClass(cl: string): void
    {
        this.clas = this.clas.length <= 0 ? cl : (this.clas + " " + cl);
    }

    protected setAttribute(attribute: string, value: any): void
    {
        this.attributes[attribute] = value;
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

    private getContentHTML(): string
    {
        return Mustache.render($(`#template-control-${this.type}`).html(), this.getAttributes()).replace(/\s+/g, " ").trim();
    }

    public getHTML(): string
    {
        return Mustache.render($("#template-listelement-controls").html(), {
            "label": this.label,
            "classes": this.clas,
            "content": this.getContentHTML()
        }).replace(/\s+/g, " ").trim();
    }

    protected addEvent(target: string, event: string, callback: ((e: any) => boolean) | ((e: any) => void)): void
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
                const t = (target.length > 0 ? element.find(target).prevObject : element)
                t.on(event, callback);
                t.trigger(event);
            });
        });
    }
}