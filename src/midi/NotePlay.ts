import {Button, Component, Entity, Game, GlobalSystem, Key, Sprite, System} from "lagom-engine";
import * as Tone from 'tone';
import {Synth} from "tone";
import {instrument, Player} from "soundfont-player"

class Note extends Component {
    keys: Key[];
    music_note: string;

    constructor(key: Key[], music_note: string) {
        super();
        this.keys = key;
        this.music_note = music_note;
    }
}

/* Tone.js */
const synthOptions = Synth.getDefaults();
synthOptions.envelope.release = 0.5;
synthOptions.volume = -10;

const synth = new Tone.Synth(synthOptions).toDestination();

/* SoundFont-player */
let trumpet: Player | undefined = undefined;
instrument(new AudioContext(), 'trumpet', {soundfont: "MusyngKite", gain: 1})
    .then((player: Player) => trumpet = player);


export class NotePlayer extends GlobalSystem {
    lowerNotes: Note[] = [
        new Note([Key.KeyQ, Key.KeyW, Key.KeyE], "F#3"),
        new Note([Key.KeyQ, Key.KeyE], "G3"),
        new Note([Key.KeyW, Key.KeyE], "G#3"),
        new Note([Key.KeyQ, Key.KeyW], "A3"),
        new Note([Key.KeyQ], "A#3"),
        new Note([Key.KeyW], "B3"),
        new Note([], "C4"),
    ];

    upperNotes: Note[] = [
        new Note([Key.KeyQ, Key.KeyW, Key.KeyE], "C#4"),
        new Note([Key.KeyQ, Key.KeyE], "D4"),
        new Note([Key.KeyW, Key.KeyE], "D#4"),
        new Note([Key.KeyQ, Key.KeyW], "E4"),
        new Note([Key.KeyQ], "F4"),
        new Note([Key.KeyW], "F#4"),
        new Note([], "G4"),
    ];

    types = () => [];

    update(delta: number): void
    {
        if (this.getScene().getGame().keyboard.isKeyDown(Key.Space)) {
            Tone.start().then(() => {
                const notes = (this.getScene().getGame().keyboard.isKeyDown(Key.ShiftLeft, Key.ShiftRight)) ? this.upperNotes : this.lowerNotes;
                const note_down = notes.map(note => note.keys.every(k => this.getScene().getGame().keyboard.isKeyDown(k)));
                for (let i = 0; i < note_down.length; i++) {
                    if (note_down[i]) {
                        // synth.triggerAttack(this.notes[i].music_note);
                        trumpet?.stop();
                        trumpet?.play(notes[i].music_note, undefined)
                        console.log(notes[i].music_note)

                        break;
                    }
                }
            });

        } else {
            // synth.triggerRelease(Tone.now());
            trumpet?.stop();
        }
    }
}
