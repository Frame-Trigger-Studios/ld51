import {Button, Component, Entity, GlobalSystem, Key, Sprite, Timer} from "lagom-engine";
import * as Tone from 'tone';
import {Synth} from "tone";
import {instrument, Player} from "soundfont-player"
import { Layers, MainMenuScene } from "../LD51";

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

    addNoteHighlight = (isLower: boolean, position: number): void => {
        const scene = this.getScene();
        // Time circles will be highlighted upon note press
        const highlightTime = 50;
        const timer = new Timer(highlightTime, null, false);
        
        const highlightEntity = scene.addEntity(new Entity("highlight", 228, 28 + ((6 - position) * 40), Layers.Background));
        const ringEntity = scene.addEntity(new Entity("highlight", 226, 26 + ((6 - position) * 40), Layers.Background));
        if (isLower) {
            ringEntity.addComponent(new Sprite(scene.game.getResource("selected-ring").texture(0, 0, 28, 0)))
            highlightEntity.addComponent(new Sprite(scene.game.getResource("selected-combo").texture(0, 0)))
        } else {
            ringEntity.addComponent(new Sprite(scene.game.getResource("selected-ring").textureFromPoints(28, 0, 28, 28)))
            highlightEntity.addComponent(new Sprite(scene.game.getResource("selected-combo").texture(0, 0)))
        }
        highlightEntity.addComponent(timer).onTrigger.register((caller) => {
            highlightEntity.destroy();
            ringEntity.destroy();
        });
    }

    types = () => [];

    update(delta: number): void {
        const game = this.getScene().getGame();
        if (game.keyboard.isKeyDown(Key.Space)) {
            Tone.start().then(() => {
                let notes;
                let highlightLower;
                if (game.keyboard.isKeyDown(Key.ShiftLeft, Key.ShiftRight)) {
                    notes = this.upperNotes;
                    highlightLower = false;
                } else {
                    notes = this.lowerNotes;
                    highlightLower = true;
                }
                for (let i = 0; i < notes.length; i++) {
                    if (notes[i].keys.every(k => game.keyboard.isKeyDown(k))) {
                        console.log(notes[i]);
                        // synth.triggerAttack(this.notes[i].music_note);
                        trumpet?.stop();
                        trumpet?.play(notes[i].music_note, undefined)
                        console.log(notes[i].music_note)
                        this.addNoteHighlight(highlightLower, i);
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


