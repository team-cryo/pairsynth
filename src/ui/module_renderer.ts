class ModuleRenderer
{
    public maxY: number;
    private modcon: ModuleConnect;

    constructor(modcon: ModuleConnect)
    {
        this.modcon = modcon;
        this.onResize();
        window.addEventListener("resize", this.onResize);
    }

    private onResize()
    {
        this.maxY = $(document).height();
    }

    getOffset(moduleIndex: number) {
        const moduleElements: JQuery<HTMLElement> = $(`.modules .module`);
        let offsetY: number = 0;
        let offsetX: number = 0;
        let widthRow: number = 0;
        let maxY: number = 400;

        moduleElements.each((index: number, e: HTMLElement) =>
        {
            if(index < moduleIndex)
            {
                const margin: number = parseInt($(e).css("margin-bottom"));
                const height: number = parseInt($(e).css("height"));
                const width: number = parseInt($(e).css("width"));
                offsetY += height + margin;
                if(offsetY > maxY)
                {
                    offsetY = 0;
                    offsetX += widthRow + margin;
                    widthRow = width;
                }
                widthRow = Math.max(widthRow, width);
            }
        });

        offsetY += $(".modules").position().top;
        offsetX += $(".modules").position().left;

        return {"x": offsetX, "y": offsetY};
    }

    renderModules(modman: ModuleManager)
    {
        $(".modules .modulePort").remove();

        modman.allModules().forEach((module: Module) => this.renderModule(module));
        $(".modulePort").on("click", (e: JQuery.ClickEvent) => {this.modcon.onMouse(e);});
    }

    renderModule(module: Module)
    {
        const template: string = module.getHTML();
        $(".modules").append(template);
        const moduleElements: JQuery<HTMLDivElement> = $(`.modules .module`);
        const moduleElement = moduleElements.eq(module.index);
        
        const ins: PortInput[] = module.getRegisteredInputs();
        const outs: PortOutput[] = module.getRegisteredOutputs();

        const elemIns: JQuery<HTMLElement> = moduleElement.find(".inputs");
        const elemOuts: JQuery<HTMLElement> = moduleElement.find(".outputs");

        ins.forEach(m => {
            elemIns.append(`<div class="modulePort moduleInput" data-pid="${m.getPid()}">
                ${m.getLabel()}<i class="fas fa-arrow-left"></i></div>`);
        });

        outs.forEach(m => {
            elemOuts.append(`<div class="modulePort moduleOutput" data-pid="${m.getPid()}">
            <i class="fas fa-arrow-right"></i>${m.getLabel()}</div>`);
        });

        const offset = this.getOffset(module.index);
        moduleElement.css("top", `${offset.y}px`);
        moduleElement.css("left", `${offset.x}px`);
        makeDraggable(moduleElement, this.modcon);
        module.attachEvents(moduleElement);
    }

    loadModules(modules: Module[])
    {
        modules.forEach(module =>
        {
            const option = document.createElement("option");
            option.value = module.index.toString();
            option.innerHTML = module.name;
            document.querySelector(".modules-list").append(option);
        });
    }
}