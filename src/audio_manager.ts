class AudioManager
{
    static scaleVolume: number = 0.5;
    audioContext: AudioContext;
    source: AudioBufferSourceNode;
    buffer: AudioBuffer;
    buflen: number;
    hasPlayed: boolean;
    playing: boolean;

    constructor()
    {
        this.audioContext = new AudioContext();
        this.source = null;
        this.buffer = null;
        this.buflen = 1; //length of buffer in seconds
        this.hasPlayed = false;
        this.playing = false;
    }

    /**
     * @return AudioBuffer
     */
    createBuffer()
    {
        return this.audioContext.createBuffer(2, this.audioContext.sampleRate * this.buflen, this.audioContext.sampleRate);
    }

    /**
     * @param modman ModuleManager
     */
    fillBuffer(modman: ModuleManager)
    {
        this.buffer = this.createBuffer();

        for (let channel = 0; channel < this.buffer.numberOfChannels; channel++)
        {
            const currentBuffer = this.buffer.getChannelData(channel);

            for (let i = 0; i < this.buffer.length; i++)
            {
                const time = i / this.audioContext.sampleRate;
                currentBuffer[i] = modman.getAudioOutput(channel, time)*AudioManager.scaleVolume;
            }
        }
    }

    play(modman: ModuleManager)
    {
        if(!this.playing)
        {
            this.fillBuffer(modman);

            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.loop = true;
            this.source.connect(this.audioContext.destination);
            this.source.start();

            this.playing = true;
            this.hasPlayed = true;
        }
    }

    pause()
    {
        this.source.stop();
        this.playing = false;
    }
}