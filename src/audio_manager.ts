class AudioManager
{
    static scaleVolume: number = 0.8;
    static buflen: number = 0.1; //buflen of 100ms allows frequencies from 20Hz and up to be sampled
    private audioContext: AudioContext;
    private source: AudioBufferSourceNode;
    private filter: BiquadFilterNode;
    private buffer: AudioBuffer;
    private buflen: number;
    private hasPlayed: boolean;
    private playing: boolean;
    private lookahead: number;
    private oldbuf: [number[], number[]];

    constructor(buflen: number = AudioManager.buflen)
    {
        this.audioContext = null;
        this.source = null;
        this.buffer = null;
        this.buflen = buflen; //length of buffer in seconds
        this.lookahead = 0.1;
        this.hasPlayed = false;
        this.playing = false;
        this.oldbuf = [[], []];
    }

    private createFilter(): void {
        this.filter = this.audioContext.createBiquadFilter();
        this.filter.type = "lowshelf";
        this.filter.frequency.value = 1000;
        this.filter.connect(this.audioContext.destination);
    }

    private createAudioContext(): void
    {
        this.audioContext = new AudioContext();
        this.createFilter();
    }

    private createBuffer(): AudioBuffer
    {
        return this.audioContext.createBuffer(2, this.audioContext.sampleRate*this.buflen*(1 + this.lookahead), this.audioContext.sampleRate);
    }

    private fillBuffer(modman: ModuleManager, smooth: boolean): void
    {
        this.buffer = this.createBuffer();
        const bufsize = this.buffer.length;
        const lookaheadoffset = Math.floor(bufsize/(1 + this.lookahead));

        for(let channel = 0; channel < this.buffer.numberOfChannels; channel++)
        {
            const oldBuffer = this.oldbuf[channel];
            const oldbufsize = oldBuffer.length;
            const currentBuffer = this.buffer.getChannelData(channel);

            for(let i = 0; i < bufsize; i++)
            {
                const time = i / this.audioContext.sampleRate;
                let wp = modman.getAudioOutput(channel, time)*AudioManager.scaleVolume;

                if(smooth)
                {
                    const ioffset = i + lookaheadoffset;
                    if(ioffset < oldbufsize)
                    {
                        const f1 = (ioffset + 0.5 - lookaheadoffset)/lookaheadoffset;
                        const f2 = 1 - f1;
                        const owp = oldBuffer[ioffset];
                        wp = owp*f2 + wp*f1;
                    }
                }

                currentBuffer[i] = wp;
                //console.log("buf");
            }
        }
    }

    public play(modman: ModuleManager, smooth: boolean = true): void
    {
        if(!this.playing || !this.hasPlayed)
        {
            this.playBuffer(modman, smooth);
        }
    }

    private playBuffer(modman: ModuleManager, smooth: boolean): void
    {
        setTimeout((modman: ModuleManager) => {
            this.refresh(modman);
        }, this.buflen*1000, modman);

        if(!this.hasPlayed)
        {
            this.createAudioContext();
            this.hasPlayed = true;
            this.fillBuffer(modman, smooth && this.playing);
        }
        
        const oldSource = this.source;
        this.source = this.audioContext.createBufferSource();
        /*this.source.onended = (event: Event) => {
            this.refresh(modman);
        };*/
        this.source.buffer = this.buffer;
        this.source.connect(this.filter);
        this.source.start();
        if(oldSource != null)
        {
            oldSource.stop();
        }
        
        this.fillBuffer(modman, smooth);

        this.playing = true;
    }

    public refresh(modman: ModuleManager, smooth: boolean = true): void
    {
        if(this.playing)
        {
            this.playing = false;
            this.playBuffer(modman, smooth);
        }
    }

    public pause(): void
    {
        if(this.hasPlayed)
        {
            this.source.stop();
        }
        this.playing = false;
    }
}