class AudioManager
{
    public static audiowoman: AudioManager; // Inclusive audio manager.

    private static scaleVolume: number = 1;
    private static sampleRate: number = 44100;
    private static bufsize: number = 32;
    private static bufferStackSize: number = 4;

    //public timing: timing = {dt: 0, cycle: 0, time: 0, buf: -1, smp: -1};

    private audioContext: AudioContext;
    private filter: BiquadFilterNode;
    private source: AudioBufferSourceNode;
    private bufferStack: AudioBuffer[];
    private bufferStackCount: number = 0;

    private playing: boolean = false;
    private smpOffset: number = 0;

    private isRecording: boolean = true;
    private smpRecOffset: number = 0;
    private recording: number[][] = [[0], [0]];
    //private lastBufferEndTime: number;

    constructor()
    {
        this.bufferStack = [];
        AudioManager.audiowoman = this;
    }

    private createFilter(): void {
        this.filter = this.audioContext.createBiquadFilter();
        this.filter.type = "lowshelf";
        this.filter.frequency.value = this.getSampleRate()/2;
        this.filter.connect(this.audioContext.destination);
    }

    private createAudioContext(sampleRate: number): void
    {
        this.audioContext = new AudioContext({sampleRate: this.getSampleRate()});
        this.createFilter();
    }

    private createEmptyBuffer(bufsize: number, sampleRate: number): AudioBuffer
    {
        if(this.audioContext == null)
        {
            this.createAudioContext(sampleRate);
        }
        return this.audioContext.createBuffer(2, bufsize, sampleRate);
    }

    private next()
    {
        if(this.playing || this.bufferStackCount > 0)
        {
            if(this.playing && this.bufferStackCount == 0)
            {
                this.bufferStack[0] = this.createEmptyBuffer(AudioManager.bufsize, this.getSampleRate());
            }
            this.playBuffer(this.bufferStack[0], (event: Event) => {
                this.bufferStackCount--;
                this.next()
            });
            this.shiftBuffers(modman, this.getSampleRate(), this.playing);
        }
    }

    public play(): void
    {
        this.playing = true;
        if(this.bufferStackCount == 0)
        {
            this.next();
        }
    }

    public pause(): void
    {
        this.playing = false;
    }

    public reset(): void
    {
        this.smpOffset = 0;
    }

    private playBuffer(buffer: AudioBuffer, callback: (event: Event) => void): void
    {
        const sampleRate = this.getSampleRate();

        if(this.audioContext == null)
        {
            this.createAudioContext(sampleRate);
        }
        
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = buffer;
        this.source.connect(this.filter);
        
        this.source.onended = callback;
        
        this.source.start();
    }
    
    private shiftBuffers(modman: ModuleManager, sampleRate: number, fillMore: boolean): void
    {
        const bufsize = AudioManager.bufsize;
        const bufferStackSize = AudioManager.bufferStackSize;
        const bufferStackShift = bufferStackSize - this.bufferStackCount;
        for(let i = 0; i < bufferStackSize; i++)
        {
            const ishifted = i + bufferStackShift;
            if(ishifted < bufferStackSize)
            {
                this.bufferStack[i] = this.bufferStack[ishifted];
            }
            else
            {
                this.bufferStack[i] = this.createEmptyBuffer(bufsize, sampleRate);
                if(fillMore)
                {
                    this.fillBuffer(this.bufferStack[i], modman, bufsize);
                }
                this.bufferStackCount++;
            }
        }
    }

    private fillBuffer(buffer: AudioBuffer, modman: ModuleManager, bufsize: number): void
    {
        const smpStart: number = this.smpOffset;
        const smpRecStart: number = this.smpRecOffset;
        const channelCount: number = buffer.numberOfChannels;

        this.smpRecOffset = smpRecStart + bufsize;
        this.smpOffset = smpStart + bufsize;

        const channelData: Float32Array[] = [];
        for(let i = 0; i < channelCount; i++)
        {
            channelData[i] = buffer.getChannelData(i);
        }

        for(let i = 0; i < bufsize; i++)
        {
            const smp = smpStart + i;
            
            const time: number = smp/this.audioContext.sampleRate;
                
            const timing: timing = {
                cycle: i/bufsize,
                time: time,
                tick: smp,
                dt: (lastTime: number) => time - lastTime
            }

            for(let channel = 0, chn = buffer.numberOfChannels; channel < chn; channel++)
            {
                const value = modman.getAudioOutput(channel, timing)*AudioManager.scaleVolume;
                channelData[channel][i] = value;

                if(this.isRecording)
                {
                    const smpRec: number = smpRecStart + i;
                    this.recording[channel][smpRec] = value;
                }
            }
        }
    }

    private getSampleRate()
    {
        return AudioManager.sampleRate;
    }
    
    public export(): string {
        const wav = new WAV(this.recording, this.getSampleRate());
        return wav.export(); // A download link for the buffer.
    }
}

type timing = {dt: ((lastTime: number) => number), cycle: number, time: number, tick: number};