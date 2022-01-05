class MIDIManager
{
    static midman: MIDIManager;

    static keyboard: string[] = [
        "z", "s", "x", "d", "c", "v", "g", "b", "h", "n", "j", "m",
        "q", "2", "w", "3", "e", "r", "5", "t", "6", "y", "7", "u", "i"
    ];

    static getKeyName(key: number)
    {
        return MIDIManager.keyboard[key];
    }

    static getKey(keyname: string)
    {
        return this.keyboard.indexOf(keyname);
    }

    private keysHeld: number[];
    private lastKey: number;

    constructor()
    {
        MIDIManager.midman = this;

        this.keysHeld = [];
        this.lastKey = -1;
        $(document).on("keydown", (e: JQuery.KeyDownEvent) => {this.onKeydownKeyboard(e);});
        $(document).on("keyup", (e: JQuery.KeyUpEvent) => {this.onKeyupKeyboard(e);});
    }

    public isKeyHeld(key: number): boolean
    {
        return this.keysHeld.indexOf(key) >= 0;
    }
    
    private pressKey(key: number): boolean
    {
        if(!this.isKeyHeld(key))
        {
            this.keysHeld.push(key);
            this.lastKey = key;
            return true;
        }
        return false;
    }

    private unpressKey(key: number): boolean
    {
        if(this.isKeyHeld(key))
        {
            this.keysHeld = _.without(this.keysHeld, key);
            return true;
        }
        return false;
    }

    private onKeydownKeyboard(e: JQuery.KeyDownEvent)
    {
        const key: number = MIDIManager.getKey(e.key);
        if(key >= 0)
        {
            this.pressKey(key);
        }
    }
    
    private onKeyupKeyboard(e: JQuery.KeyUpEvent)
    {
        const key: number = MIDIManager.getKey(e.key);
        if(key >= 0)
        {
            this.unpressKey(key);
        }
    }

    public monoNote(controller: MIDIManager.EController): number
    {
        if(controller === MIDIManager.EController.Keyboard)
        {
            return this.lastKey;
        }
        return -1;
    }

    public gate(controller: MIDIManager.EController)
    {
        if(controller === MIDIManager.EController.Keyboard)
        {
            return this.keysHeld.length > 0;
        }
        return false;
    }

    public monoNoteOct(controller: MIDIManager.EController)
    {
        return this.monoNote(controller)/(MIDIManager.keyboard.length - 1);
    }
}
module MIDIManager
{
    export enum EController
    {
        Keyboard = 0 as number
    }
}