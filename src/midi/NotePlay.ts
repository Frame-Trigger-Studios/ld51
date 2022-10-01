import {Button, Component, Entity, Game, GlobalSystem, Key, Sprite, System} from "lagom-engine";
import * as Tone from 'tone';

class Note extends Component {
    key: Key[];
    music_note: string;
    on: boolean;

    constructor(key: Key[], music_note: string) {
        super();
        this.key = key;
        this.music_note = music_note;
        this.on = false;
    }
}

const synth = new Tone.Synth().toDestination();


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

    currentNote?:Note = undefined;

    types = () => [];

    update(delta: number): void
    {
        if (this.getScene().getGame().keyboard.isKeyDown(Key.Space)) {
            this.notes.some(note => {
                if (note.key.every(k => this.getScene().getGame().keyboard.isKeyDown(k)) && !note.on && !this.currentNote) {
                    this.notes.forEach(note => note.on = false);
                    synth.triggerAttack(note.music_note);
                    this.currentNote = note;
                    // note.on = true;
                    return true;
                } else if (note.key.some(k => this.getScene().getGame().keyboard.isKeyReleased(k)) && this.currentNote) {
                    this.currentNote = undefined;
                }
            });
        } else {
            synth.triggerRelease(Tone.now());
            // this.notes.forEach(note => note.on = false);
            this.currentNote = undefined;
        }
    }
}