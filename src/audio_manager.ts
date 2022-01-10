class AudioManager
{
    public static audiowoman: AudioManager; // Inclusive audio manager.

    private static scaleVolume: number = 0.8;
    private static sampleRate: number = 44100;
    private static buflenMin: number = 100/AudioManager.sampleRate;
    private static buflenMax: number = 10;
    private static buflenGrowth: number = 0.1;

    public timing: timing = {dt: 0, cycle: 0, time: 0, buf: -1, smp: -1};

    private audioContext: AudioContext;
    private filter: BiquadFilterNode;
    private source: AudioBufferSourceNode;
    private buffer: AudioBuffer;
    private hasPlayed: boolean = false;
    private playing: boolean = false;
    private bufcount: number = 0;
    private buf: number = 0;
    private lastSmpOffset: number = 0;
    private smpOffset: number = 0
    private bufsizeLast: number = 0;
    private smpLastRefresh: number = 0;
    private recording: number[][] = [[0], [0]];
    private lastBufferEndTime: number;

    constructor()
    {
        AudioManager.audiowoman = this;
    }

    private createFilter(): void {
        this.filter = this.audioContext.createBiquadFilter();
        this.filter.type = "lowshelf";
        this.filter.frequency.value = AudioManager.sampleRate/4;
        this.filter.connect(this.audioContext.destination);
    }

    public getSampleLenMax()
    {
        return Math.round(AudioManager.buflenMax/AudioManager.sampleRate);
    }

    private createAudioContext(): void
    {
        this.audioContext = new AudioContext({sampleRate: AudioManager.sampleRate});
        this.createFilter();
    }

    private createBuffer(buflen: number): void
    {
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

        this.bufsizeLast = bufsizeactual;
        this.lastSmpOffset = bufsizeactual;
        this.buf++;
        this.smpOffset += bufsizeactual;
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
        if(this.playing && this.bufcount <= 1)
        {
            this.bufcount--
            const timeTurnback = this.lastBufferEndTime - Date.now()/1000;
            this.smpLastRefresh = this.timing.smp;
            if(timeTurnback > AudioManager.buflenMin*2)
            {
                const smpTurnback = Math.round(timeTurnback*AudioManager.sampleRate);
                if(smpTurnback > this.bufsizeLast - AudioManager.buflenMin/AudioManager.sampleRate)
                {
                    return;
                }
                this.smpLastRefresh -= smpTurnback;
            }
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
            const timeTurnback = this.lastBufferEndTime - Date.now()/1000;
            if(timeTurnback > AudioManager.buflenMin)
            {
                this.source.stop();
                const smpTurnback = Math.round(timeTurnback*AudioManager.sampleRate);
                this.buf--;
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

            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.connect(this.filter);
            this.bufcount++;
            this.source.start();
            this.lastBufferEndTime = Date.now()/1000 + this.buffer.length*AudioManager.sampleRate;
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
        const bl1 = Math.min(AudioManager.buflenMax, Math.max(1/1000 + AudioManager.buflenMin, (this.timing.smp - this.smpLastRefresh)*this.timing.dt));
        const buflen = Math.min(bl1, this.bufsizeLast*AudioManager.sampleRate*(1 - AudioManager.buflenGrowth) + bl1*AudioManager.buflenGrowth);
        return buflen;
    }
    
    public export(): string {
        const wav = new WAV(this.recording, AudioManager.sampleRate);
        return wav.export(); // A download link for the buffer.
    }
}

type timing = {dt: number, cycle: number, time: number, buf: number, smp: number};