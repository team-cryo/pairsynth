class Menu {
    public menu: JQuery<HTMLElement>;

    constructor(title: string = "") {
        this.menu = Util.template("#template-menu", {}, "body");
        this.createTitle(title);
        this.menu.find(".menuClose").on("click", (e: JQuery.ClickEvent) => this.onClickClose(e));
    }

    private onClickClose(e: JQuery.ClickEvent) {
        this.menu.remove();
    }

    private createTitle(title: string) {
        const elemTitle = $(`<h2 class="menuTitle">${title}</h2>`);
        this.addElement(elemTitle);
    }

    public addElement(element: JQuery<HTMLElement> | HTMLElement | string) {
        this.menu.append(element);
    }
}