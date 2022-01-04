interface IModule extends IHTMLable
{

}

interface IModuleCVInSingle
{
    getCV(): PortInput;
}

interface IModuleInputSingle
{
    getInput(): PortInput;
}

interface IModuleOutputSingle
{
    getOutput(): PortOutput;
}

interface IModuleCVOutSingle
{
    getCV(): PortOutput;
}

interface IModuleKeyboardMono extends IModuleCVOutSingle
{
    getGate(): PortOutput;
}

interface IHTMLable
{
    getHTML(): string
}