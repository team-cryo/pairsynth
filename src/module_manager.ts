class ModuleManager {
    private output: ModuleOutput;
    private modules: Module[]; //All active modules

    constructor(modules: Module[] = []) {
        this.modules = modules;
        this.output = this.addModule(new ModuleOutput());
    }

    getOutput(ch: number): PortInput
    {
        return this.output.getInput(0);
    }

    getAudioOutput(ch: number, time: number) {
        return this.output.getAudioOutput(ch, time);
    }

    addModule<Type extends Module>(module: Type): Type {
        this.modules[module.index] = module;
        return module;
    }

    deleteModule(module: Module)
    {
        this.modules[module.index] = null;
    }

    hasModule(module: Module)
    {
        return module.index < this.modules.length;
    }

    getModuleByIndex(index: number): Module {
        if(index < this.modules.length)
            return this.modules[index];
        return null;
    }

    allModules()
    {
        return [...this.modules];
    }

    getConnections(): Connection[]
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

    forEachModule(func: Function)
    {

    }
}