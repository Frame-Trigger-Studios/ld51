import {Button, Component, Entity, Game, GlobalSystem, Key, Sprite, System} from "lagom-engine";
import * as Tone from 'tone';
import {Synth} from "tone";

class Note extends Component {
    keys: Key[];
    music_note: string;
    on: boolean;

    constructor(key: Key[], music_note: string) {
        super();
        this.keys = key;
        this.music_note = music_note;
        this.on = false;
    }
}

const synthOptions = Synth.getDefaults();
synthOptions.envelope.release = 0.5;
synthOptions.volume = -10;

const synth = new Tone.Synth(synthOptions).toDestination();


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
                        this.notes.forEach(note => note.on = false);
                        synth.triggerAttack(this.notes[i].music_note);
                        break;
                    }
                }
            });

        } else {
            synth.triggerRelease(Tone.now());
        }
    }
}
