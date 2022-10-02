import {InstrumentName} from "soundfont-player";

export interface TempoEvent
{
    ticks: number;
    bpm: number;
    time?: number;
}

export interface TimeSignatureEvent
{
    ticks: number;
    timeSignature: number[];
    measures?: number;
}

export interface KeySignatureEvent
{
    ticks: number;
    key: string;
    scale: string;
}

export interface MetaEvent
{
    text: string;
    type: string;
    ticks: number;
}


export type MidiTrack = {
    // the transport and timing data
    header: {
        name: string,                     // the name of the first empty track,
                                          // which is usually the song name
        keySignatures: KeySignatureEvent[],
        meta: MetaEvent[],
        tempos: TempoEvent[],             // the tempo, e.g. 120
        timeSignatures: TimeSignatureEvent[],  // the time signature, e.g. [4, 4],
        ppq: number                       // the Pulses Per Quarter of the midi file
                                          // this is read only
    },

    duration?: number,                   // the time until the last note finishes

    // an array of midi tracks
    tracks:
        {
            name: string,                   // the track name if one was given

            channel: number,                // channel
                                            // the ID for this channel; 9 and 10 are
                                            // reserved for percussion
            pitchBends: any[],
            endOfTrackTicks: number,
            notes:
                {
                    duration: number,           // duration in seconds between noteOn and noteOff
                    durationTicks?: number,
                    midi: number,               // midi number, e.g. 60
                    name: string,               // note name, e.g. "C4",
                    ticks: number,              // time in ticks
                    time: number,               // time in seconds
                    velocity: number,           // normalized 0-1 velocity
                    pitch?: string,              // the pitch class, e.g. "C",
                    octave?: number,            // the octave, e.g. 4
                }[],

            // midi control changes
            controlChanges: {
                // if there are control changes in the midi file
                [key: string]: [
                    {
                        number: number,           // the cc number
                        ticks: number,            // time in ticks
                        time: number,             // time in seconds
                        value: number,            // normalized 0-1
                    }
                ],
            },

            instrument: {                   // and object representing the program change events
                number: number,              // the instrument number 0-127
                family: string,               // the family of instruments, read only.
                name: InstrumentName,                // the name of the instrument
                percussion?: boolean,          // if the instrument is a percussion instrument
            },
        }[]
};
