import {Button, Component, Entity, Game, GlobalSystem, Key, Sprite, System} from "lagom-engine";
import * as Tone from 'tone';

export class Player extends Entity {


    onAdded() {
        super.onAdded();
        this.addComponent(new Trumpet());
        console.log("onadded");
    }
}

class Note extends Component {
    key: Key;
    music_note: string;
    on: boolean;

    constructor(key: Key, music_note: string) {
        super();
        this.key = key;
        this.music_note = music_note;
        this.on = false;
    }
}

export class Trumpet extends Component {
    notes: Note[] = [
        new Note(Key.KeyQ, "C4"),
        new Note(Key.KeyW, "D4"),
    ];

}

const synth = new Tone.Synth().toDestination();

export class NotePlayer extends GlobalSystem {
    notes: Note[] = [
        new Note(Key.KeyQ, "C4"),
        new Note(Key.KeyW, "D4"),
        new Note(Key.KeyE, "E4"),
    ];

    types = () => [];

    update(delta: number): void
    {
        if (this.getScene().getGame().keyboard.isKeyDown(Key.Space)) {
            this.notes.forEach(note => {
                if (this.getScene().getGame().keyboard.isKeyDown(note.key) && !note.on) {
                    synth.triggerAttack(note.music_note);
                    note.on = true;
                } else if (this.getScene().getGame().keyboard.isKeyReleased(note.key)) {
                    note.on = false;
                }
            });
        } else {
            synth.triggerRelease(Tone.now());
            this.notes.forEach(note => note.on = false);
        }
    }
}