class ModuleManager {
    public static modman: ModuleManager;

    private output: ModuleOutput;
    private modules: Module[]; //All active modules

    constructor(modules: Module[] = []) {
        ModuleManager.modman = this;
        this.modules = modules;
        this.output = this.addModule(this.addModule(new ModuleOutput()));
    }

    public getOutput(ch: number): PortInput
    {
        return this.output.getInput(ch);
    }

    public getAudioOutput(ch: number): number {
        return this.output.getAudioOutput(ch);
    }

    public addModule<Type extends Module>(module: Type): Type {
        this.modules[module.index] = module;
        return module;
    }

    public deleteModule(module: Module): boolean
    {
        if(module != this.output && this.hasModule(module))
        {
            this.modules[module.index] = null;
            return true;
        }
        return false;
    }

    public hasModule(module: Module): boolean
    {
        return module.index < this.modules.length && this.modules[module.index] != null;
    }

    public getModuleByIndex(index: number): Module
    {
        if(index < this.modules.length)
        {
            return this.modules[index];
        }
        return null;
    }

    public allModules(): Module[]
    {
        return [...this.modules];
    }

    public getConnections(): Connection[]
    {
        const cs: Connection[] = [];
        this.allModules().forEach((module: Module) => {
            module.getRegisteredInputs().forEach((port: PortInput) => {
                const con: Connection = port.getConnection();
                if(con != null && con.isMade())
                {
                    cs.push(con);
                }
            });
        });
        return cs;
    }

    public beginNewBufferLog(): void
    {
        this.allModules().forEach((module: Module) => {
            module.beginNewBufferLog();
        });
    }
}