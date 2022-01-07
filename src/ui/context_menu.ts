class ContextMenu
{
    private contextMenu: JQuery<HTMLElement>;

    constructor()
    {
        this.contextMenu = null;
        $(document).on("contextmenu", (e: JQuery.ContextMenuEvent) => {this.updateContextMenu(e);});
        $(document).on("click", (e: JQuery.ClickEvent) =>
        {
            this.onClick(e);
        });
    }

    updateContextMenu(e: JQuery.ContextMenuEvent)
    {
        e.preventDefault();
        if(this.contextMenu !== null)
        {
            this.killContextMenu();
        }
        this.createContextMenu();
        this.contextMenu.css("top", e.clientY);
        this.contextMenu.css("left", e.clientX);
    }

    private onOptionClick(element: HTMLLIElement)
    {
        const name: string = $(element).data("name");
        
        switch (name) {
            case "play":
                AudioManager.audiowoman.play();
            break;
            case "stop":
                AudioManager.audiowoman.pause();
            break;
            case "addmodule":
                this.addModuleFromMenu();
            break
            case "export":
                const link = AudioManager.audiowoman.export();

                const download = document.createElement("a");
                download.href = link;
                download.download = "file.wav";
                download.innerHTML = "Download";

                const menu = new Menu("Export");
                menu.addElement(download);
            break;
        }
    }
    
    createContextMenu()
    {
        this.contextMenu = Util.template("#template-context-menu", {}, "body");
        const menuOps: JQuery<HTMLLIElement> = this.contextMenu.find("li");
        menuOps.each((index: number, eo: HTMLLIElement) => {
            $(eo).on("click", (e: JQuery.ClickEvent) =>
            {
                this.onOptionClick(eo);
            });
        });
    }

    private killContextMenu()
    {
        if(this.contextMenu != null)
        {
            this.contextMenu.remove();
        }
        this.contextMenu = null;
    }

    private onClick(e: JQuery.ClickEvent)
    {
        if(e.target === this.contextMenu)
        {
            this.createContextMenu();
        }
        this.killContextMenu();
    }

    addModuleFromMenu() {
        ModuleManager.modman.addModule(new ModuleNoise());
        const addModuleMenu = Util.template("#template-add-module", {}, "body");
        ModuleRenderer.modrend.renderModules();
    }
}