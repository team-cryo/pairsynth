const Util = {
    template: function(id: string, params: object, dest: string): JQuery<HTMLElement> {
        const template: string = Mustache.render($(id).html(), params);
        const elem: JQuery<HTMLElement> = $(template);
        $(dest).append(elem);
        return elem;
    },

    clamp(num: number, min: number, max: number) {
        return Math.min(Math.max(num, min), max);
    }
};