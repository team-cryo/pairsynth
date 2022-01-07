class AudioManager
{
    public static audiowoman: AudioManager; // Inclusive audio manager.

    private static scaleVolume: number = 0.1;
    private static sampleRate: number = 22050;
    private static buflenMin: number = 2/AudioManager.sampleRate;
    private static buflenMax: number = 100;
    private static buflenGrowth: number = 0.8;

    public timing: timing = {dt: 0, cycle: 0, time: 0, buf: -1, smp: -1};

    private audioContext: AudioContext;
    private source: AudioBufferSourceNode;
    private filter: BiquadFilterNode;
    private buffer: AudioBuffer;
    private hasPlayed: boolean = false;
    private playing: boolean = false;
    private bufcount: number = 0;
    private buf: number = 0;
    private lastSmpOffset: number = 0;
    private smpOffset: number = 0
    private buflenLast: number = 0;
    private smpLastRefresh: number = 0;
    private recording: number[][] = [[0], [0]];
    private lastBufferEndTime: number;

    constructor()
    {
        AudioManager.audiowoman = this;
    }

    public getSampleLenMax()
    {
        return Math.round(AudioManager.buflenMax/AudioManager.sampleRate);
    }

    private createFilter(): void {
        this.filter = this.audioContext.createBiquadFilter();
        this.filter.type = "lowshelf";
        this.filter.frequency.value = 11025;
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
        const bufsizeactual = Math.round(this.audioContext.sampleRate*buflen);

        for(let channel = 0, chn = this.buffer.numberOfChannels; channel < chn; channel++)
        {
            const currentBuffer = this.buffer.getChannelData(channel);

            this.timing = {
                dt: 1/this.audioContext.sampleRate,
                cycle: 0,
                buf: this.buf,
                smp: this.smpOffset,
                time: this.smpOffset*this.timing.dt
            }

            modman.beginNewBufferLog();

            for(let i = 0; i < bufsizeactual; i++)
            {
                this.timing.cycle = i/bufsizeactual;
                this.timing.smp = this.smpOffset + i;
                this.timing.time = this.timing.smp*this.timing.dt;
                currentBuffer[i] = modman.getAudioOutput(channel)*AudioManager.scaleVolume;
                this.recording[channel][this.timing.smp] = currentBuffer[i];
            }
        }

        this.buflenLast = bufsizeactual;
        this.buf++;
        this.lastSmpOffset = bufsizeactual;
        this.smpOffset += bufsizeactual;
        this.lastBufferEndTime = Date.now()/1000 + buflen;
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
        if(this.playing)
        {
            this.smpLastRefresh = this.timing.smp;
            this.stopBuffer();
        }
    }

    public pause(): void
    {
        this.playing = false;
        this.stopBuffer();
    }

    public reset(): void
    {
        this.smpOffset = 0;
    }

    private stopBuffer(): void
    {
        if(this.bufcount > 0)
        {
            this.source.stop();
            const timeTurnback = this.lastBufferEndTime - Date.now()/1000;
            if(timeTurnback > 0)
            {
                const smpTurnback = Math.round(timeTurnback*AudioManager.sampleRate);
                this.smpOffset = Math.max(this.lastSmpOffset + 1, this.smpOffset - smpTurnback);
            }
        }
    }
    
    private playBuffer(modman: ModuleManager): void
    {
        const buflen = this.getBuflen();
        if(this.bufcount <= 0)
        {
            this.hasPlayed = true;
            this.createAudioContext();
            this.createBuffer(buflen);
            this.fillBuffer(modman, buflen);
        }
        if(this.bufcount <= 1)
        {
            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.connect(this.filter);
            this.source.start();
            this.createBuffer(buflen);
            this.fillBuffer(modman, buflen);
            
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

    private getBuflen(): number
    {
        const bl1 = Math.min(AudioManager.buflenMax, Math.max(AudioManager.buflenMin, (this.timing.smp - this.smpLastRefresh)*this.timing.dt));
        const buflen = Math.min(bl1, this.buflenLast*(1 - AudioManager.buflenGrowth) + bl1*AudioManager.buflenGrowth);
        return buflen;
    }
}

type timing = {dt: number, cycle: number, time: number, buf: number, smp: number};