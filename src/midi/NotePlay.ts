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
    notes: Note[] = [
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
                const note_down = this.notes.map(note => note.keys.every(k => this.getScene().getGame().keyboard.isKeyDown(k)));
                for (let i = 0; i < note_down.length; i++) {
                    if (note_down[i]) {
                        // synth.triggerAttack(this.notes[i].music_note);
                        trumpet?.stop();
                        trumpet?.play(this.notes[i].music_note, undefined)

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
