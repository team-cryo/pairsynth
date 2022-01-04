function makeDraggable(module: JQuery<HTMLDivElement>, modcon: ModuleConnect) {
    type Pos = {
        x: number,
        y: number
    };

    let mousePosition: Pos;
    let offset: Pos = {x: 0, y: 0};
    let div: JQuery<HTMLDivElement> = module;
    let isDown: boolean = false;
    let modcon: ModuleConnect = modcon;
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
        modcon.onMouse(e);
    });
    
    doc.on("mousemove", (e: JQuery.MouseMoveEvent) => {
        e.preventDefault();
        if (isDown) {
            modcon.onMouse(e);
            mousePosition = {
        
                x: e.clientX,
                y: e.clientY
        
            };
            div.css("left", (mousePosition.x + offset.x) + 'px');
            div.css("top", (mousePosition.y + offset.y) + 'px');
        }
    });
}
