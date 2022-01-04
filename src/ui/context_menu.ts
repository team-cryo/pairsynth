class ContextMenu
{
    private contextMenu: JQuery<HTMLElement>;
    private audiowoman: AudioManager; // Inclusive audio manager.
    private modman: ModuleManager;
    private modrend: ModuleRenderer;

    constructor(audiowoman: AudioManager, modman: ModuleManager, modrend: ModuleRenderer)
    {
        this.contextMenu = null;
        this.audiowoman = audiowoman;
        this.modman = modman;
        this.modrend = modrend;
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
                this.audiowoman.play(this.modman);
            break;
            case "stop":
                this.audiowoman.pause();
            break;
            case "addmodule":
                this.addModuleFromMenu();
            break
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
        this.modman.addModule(new ModuleNoise());
        const addModuleMenu = Util.template("#template-add-module", {}, "body");
        this.modrend.renderModules(this.modman);
    }
}