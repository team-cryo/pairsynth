class AudioManager
{
    public static audiowoman: AudioManager; // Inclusive audio manager.

    private static scaleVolume: number = 0.1;
    private static buflen: number = 2;
    private static buflenRefresh: number = 0.001;
    private static sampleRate: number = 22050;

    public static timing: timing = {dt: 0, cycle: 0, time: 0, buf: -1};

    private audioContext: AudioContext;
    private source: AudioBufferSourceNode;
    private filter: BiquadFilterNode;
    private buffer: AudioBuffer;
    private hasPlayed: boolean = false;
    private playing: boolean = false;
    private timeoffset: number = 0;
    private bufcount: number = 0;

    constructor()
    {
        AudioManager.audiowoman = this;
    }

    private createFilter(): void {
        this.filter = this.audioContext.createBiquadFilter();
        this.filter.type = "lowshelf";
        this.filter.frequency.value = 20000;
        this.filter.connect(this.audioContext.destination);
    }

    private createAudioContext(): void
    {
        this.audioContext = new AudioContext({sampleRate: AudioManager.sampleRate});
        this.createFilter();
    }

    private createBuffer(buflen: number): void
    {
        this.bufcount++;
        this.buffer = this.audioContext.createBuffer(2, this.audioContext.sampleRate*buflen, this.audioContext.sampleRate);
    }

    private fillBuffer(modman: ModuleManager, buflen: number): void
    {
        const bufsize = this.buffer.length;

        for(let channel = 0, chn = this.buffer.numberOfChannels; channel < chn; channel++)
        {
            const currentBuffer = this.buffer.getChannelData(channel);

            AudioManager.timing = {
                dt: 1/this.audioContext.sampleRate,
                cycle: 0,
                time: 0,
                buf: this.timeoffset
            }

            for(let i = 0; i < bufsize; i++)
            {
                AudioManager.timing.cycle = i/bufsize;
                AudioManager.timing.time = (this.timeoffset + i)/this.audioContext.sampleRate;
                currentBuffer[i] = modman.getAudioOutput(channel)*AudioManager.scaleVolume;
            }
        }
        this.timeoffset += bufsize;
    }

    public play(): void
    {
        const modman = ModuleManager.modman;
        if(!this.playing || !this.hasPlayed)
        {
            this.playBuffer(modman);
        }
    }

    public refresh(): void
    {
        const modman = ModuleManager.modman;
        if(this.playing)
        {
            this.stopBuffer();
            this.fillBuffer(modman, AudioManager.buflenRefresh)
            this.playBuffer(modman);
        }
    }

    public pause(): void
    {
        this.stopBuffer();
    }

    private stopBuffer(): void
    {
        this.playing = false;
        if(this.bufcount > 0)
        {
            this.source.stop();
        }
    }
    
    private playBuffer(modman: ModuleManager): void
    {
        if(this.bufcount <= 0)
        {
            this.hasPlayed = true;
            this.createAudioContext();
            this.createBuffer(AudioManager.buflen);
            this.fillBuffer(modman, AudioManager.buflen);
        }
        if(this.bufcount <= 1)
        {
            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.connect(this.filter);
            this.source.start();
            this.createBuffer(AudioManager.buflen);
            this.fillBuffer(modman, AudioManager.buflen);
            
            this.source.onended = (event: Event) => {
                this.bufcount--
                if(this.playing)
                {
                    this.playBuffer(modman);
                }
            };
        }

        this.playing = true;
    }
}

type timing = {dt: number, cycle: number, time: number, buf: number};