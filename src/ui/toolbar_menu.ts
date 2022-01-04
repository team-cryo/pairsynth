class ToolbarMenu {
    constructor() {
        const items: JQuery<HTMLElement> = $(".toolbar .toolbar-item")
        
        items.each((index, item) =>
        {
            $(item).on("mouseover", (e: JQuery.MouseOverEvent) => {this.mouseOverItem(e);});
        });
    }

    public onExport() {
        //export file
    }

    private mouseOverItem(event: JQuery.MouseOverEvent)
    {
        const type: string = event.target.getAttribute("data-type");
        $(`.menu-${type}`).css("display", "block");

        $(event.target).on("mouseleave", () => 
        {
            $(`.menu-${type}`).css("display", "none");
        });
    }
}