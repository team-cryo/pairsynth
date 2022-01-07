class WAV {
    public recording: number[][];
    private sampleRate: number;
    private pos: number = 0;
    private headerSize: number = 44;

    constructor(recording: number[][], sampleRate: number) {
        this.recording = recording;
        this.sampleRate = sampleRate;
    }

    public export(): string {
        return URL.createObjectURL(this.bufferToWAV());
    }

    private setUint16(view: DataView, data: number) {
        view.setUint16(this.pos, data, true);
        this.pos += 2;
    }

    private setUint32(view: DataView, data: number) {
        view.setUint32(this.pos, data, true);
        this.pos += 4;
    }

    private writeHeader(view: DataView, length: number) {
        this.setUint32(view, 0x46464952); // RIFF
        this.setUint32(view, length - 8); // File size
        this.setUint32(view, 0x45564157); // WAVE
        this.setUint32(view, 0x20746d66); // "fmt"
        this.setUint32(view, 16); // Subchunk size
        this.setUint16(view, 1); // PCM = 1, no compression.
        this.setUint16(view, this.recording.length); // Number of channels.
        this.setUint32(view, this.sampleRate); // Sample rate.
        this.setUint32(view, this.sampleRate * this.recording.length * 2); // bitsperSample / 8 = 2.
        this.setUint16(view, this.recording.length * 2); // Numchannels * bitsperchannel / 8
        this.setUint16(view, 16); // Bits per sample
        this.setUint32(view, 0x61746164); // "data"
        this.setUint32(view, length - this.pos - 4); // File size
    }

    private bufferToWAV(): Blob  {
        const length: number = this.recording[0].length * this.recording.length * 2 + this.headerSize;
        const buffer: ArrayBuffer = new ArrayBuffer(length);
        const view: DataView = new DataView(buffer);
        let offset = 0;
        let currentSample = 0;

        this.writeHeader(view, length);
    
        while (this.pos < length)
        {
            for (let i = 0; i < this.recording.length; i++)
            {
                currentSample = Util.clamp(this.recording[i][offset], -1, 1);
                view.setInt16(this.pos, 
                    currentSample < 0 ? currentSample * 0x8000 : currentSample * 0x7FFF, true);
                this.pos += 2;
            }

            offset++;
        }
    
        return new Blob([buffer], {type: "audio/wav"});
    }
}