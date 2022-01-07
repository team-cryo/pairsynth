function makeDraggable(module: JQuery<HTMLDivElement>, modcon: ModuleConnect) {
    type Pos = {
        x: number,
        y: number
    };

    let mousePosition: Pos;
    let offset: Pos = {x: 0, y: 0};
    let div: JQuery<HTMLElement> = module.find(".header");
    let isDown: boolean = false;
    let doc: JQuery<Document> = $(document);
    
    // https://stackoverflow.com/a/24050777.

    div.on("mousedown", (e: JQuery.MouseDownEvent) => {
        isDown = true;
        let pos: JQuery.Coordinates = div.offset();
        offset = {
            x: pos.left - e.clientX,
            y: pos.top - e.clientY
        };
    });
    
    doc.on("mouseup", (e: JQuery.MouseUpEvent) => {
        isDown = false;
    });
    
    doc.on("mousemove", (e: JQuery.MouseMoveEvent) => {
        if (isDown && !$(e.target).hasClass(".controlInput")) {
            e.preventDefault();
            mousePosition = {
                x: e.clientX,
                y: e.clientY
            };
            module.css("left", (mousePosition.x + offset.x) + 'px');
            module.css("top", (mousePosition.y + offset.y) + 'px');
            modcon.onMouse(e, module);
        }
    });
}
