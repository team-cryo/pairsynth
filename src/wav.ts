class WAV
{
    public recording: number[][];
    private sampleRate: number;
    private index: number = 0;
    private headerSize: number = 44;
    private bitsPerSample: number = 16;
    private length: number = 0;
    private dataView: DataView;

    constructor(recording: number[][], sampleRate: number)
    {
        this.recording = recording;
        this.sampleRate = sampleRate;
        this.length = this.recording[0].length * this.recording.length * 2 + this.headerSize;
    }

    public export(): string
    {
        return URL.createObjectURL(this.bufferToWAV());
    }

    private writeString(dataView: DataView, str: string)
    {
        for (let i = 0; i < str.length; i++)
        {
            dataView.setUint8(this.index + i, str.charCodeAt(i));
        }

        this.index += str.length;
    }

    private writeUint16(dataView: DataView, data: number)
    {
        dataView.setUint16(this.index, data, true);
        this.index += 2;
    }

    private writeUint32(dataView: DataView, data: number)
    {
        dataView.setUint32(this.index, data, true);
        this.index += 4;
    }

    private writeHeader(dataView: DataView, length: number)
    {
        this.writeString(dataView, "RIFF"); // RIFF
        this.writeUint32(dataView, length - 8); // File size
        this.writeString(dataView, "WAVE"); // WAVE
        this.writeString(dataView, "fmt "); // "fmt"
        this.writeUint32(dataView, 16); // Subchunk size
        this.writeUint16(dataView, 1); // PCM = 1, no compression.
        this.writeUint16(dataView, this.recording.length); // Number of channels.
        this.writeUint32(dataView, this.sampleRate); // Sample rate.
        this.writeUint32(dataView, this.sampleRate * this.recording.length * 2); // bitsperSample / 8 = 2.
        this.writeUint16(dataView, this.recording.length * 2); // Numchannels * bitsperchannel / 8
        this.writeUint16(dataView, this.bitsPerSample); // Bits per sample
        this.writeString(dataView, "data"); // "data"
        this.writeUint32(dataView, this.recording[0].length * this.recording.length * 2); // File size
    }

    private writeSamples(dataView: DataView, length: number)
    {
        let currentSample: number = 0;
        let j: number = 0;

        while (this.index < length)
        {
            for (let i = 0; i < this.recording.length; i++)
            {
                currentSample = Util.clamp(this.recording[i][j], -1, 1);
                dataView.setInt16(this.index, 
                    currentSample < 0 ? currentSample * 0x8000 : currentSample * 0x7FFF, true);
                this.index += 2;
            }

            j++;
        }
    }

    private bufferToWAV(): Blob
    {
        this.dataView = new DataView(new ArrayBuffer(this.length));

        this.writeHeader(this.dataView, this.length);
        this.writeSamples(this.dataView, this.length);
    
        return new Blob([this.dataView.buffer], {type: "audio/wav"});
    }
}