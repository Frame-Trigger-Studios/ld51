import {Component, GlobalSystem, Key} from "lagom-engine";
import * as Tone from 'tone';
import {Synth} from 'tone';
import {instrument, Player} from "soundfont-player"
import {MainMenuScene} from "../LD51";

export class Note extends Component {
    constructor(public keys: Key[], public music_note: string) {
        super();
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

export const lowerNotes: Note[] = [
    new Note([Key.KeyQ, Key.KeyW, Key.KeyE], "F#3"),
    new Note([Key.KeyQ, Key.KeyE], "G3"),
    new Note([Key.KeyW, Key.KeyE], "G#3"),
    new Note([Key.KeyQ, Key.KeyW], "A3"),
    new Note([Key.KeyQ], "A#3"),
    new Note([Key.KeyW], "B3"),
    new Note([], "C4"),
];

export const upperNotes: Note[] = [
    new Note([Key.KeyQ, Key.KeyW, Key.KeyE], "C#4"),
    new Note([Key.KeyQ, Key.KeyE], "D4"),
    new Note([Key.KeyW, Key.KeyE], "D#4"),
    new Note([Key.KeyQ, Key.KeyW], "E4"),
    new Note([Key.KeyQ], "F4"),
    new Note([Key.KeyW], "F#4"),
    new Note([], "G4"),
];

export class NotePlayer extends GlobalSystem {

    types = () => [];

    update(delta: number): void {
        const game = this.getScene().getGame();
        if (game.keyboard.isKeyDown(Key.Space)) {
            Tone.start().then(() => {
                const notes = (game.keyboard.isKeyDown(Key.ShiftLeft, Key.ShiftRight)) ? upperNotes : lowerNotes;

                for (let i = 0; i < notes.length; i++) {
                    if (notes[i].keys.every(k => game.keyboard.isKeyDown(k))) {
                        console.log(notes[i]);
                        // synth.triggerAttack(this.notes[i].music_note);
                        trumpet?.stop();
                        trumpet?.play(notes[i].music_note, undefined)
                        console.log(notes[i].music_note)
                        break;
                    }
                } 
            });

        }
        else if (game.keyboard.isKeyDown(Key.Digit0)) {
            game.setScene(new MainMenuScene(game));
        } else {
            // synth.triggerRelease(Tone.now());
            trumpet?.stop();
        }
    }
}


