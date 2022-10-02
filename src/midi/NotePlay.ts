import {Component, GlobalSystem, Key, Log} from "lagom-engine";
import {MainMenuScene} from "../LD51";
import {SoundFontPlayer} from "@magenta/music/es6";

export class Note extends Component
{
    constructor(public keys: Key[], public music_note: number)
    {
        super();
    }
}

export const lowerNotes: Note[] = [
    new Note([Key.KeyQ, Key.KeyW, Key.KeyE], 54),
    new Note([Key.KeyQ, Key.KeyE], 55),
    new Note([Key.KeyW, Key.KeyE], 56),
    new Note([Key.KeyQ, Key.KeyW], 57),
    new Note([Key.KeyQ], 58),
    new Note([Key.KeyW], 59),
    new Note([], 60),
];

export const upperNotes: Note[] = [
    new Note([Key.KeyQ, Key.KeyW, Key.KeyE], 61),
    new Note([Key.KeyQ, Key.KeyE], 62),
    new Note([Key.KeyW, Key.KeyE], 63),
    new Note([Key.KeyQ, Key.KeyW], 64),
    new Note([Key.KeyQ], 65),
    new Note([Key.KeyW], 66),
    new Note([], 67),
];

export class NotePlayer extends GlobalSystem
{
    private trumpet: SoundFontPlayer | undefined;

    private playing: number[] = [];


    constructor()
    {
        super();

        loadTrumpet().then(value => {
            this.trumpet = value;
        });
    }

    types = () => [];

    update(delta: number): void
    {
        const game = this.getScene().getGame();
        if (game.keyboard.isKeyDown(Key.Space))
        {
            const notes = (game.keyboard.isKeyDown(Key.ShiftLeft, Key.ShiftRight)) ? upperNotes : lowerNotes;

            for (let i = 0; i < notes.length; i++)
            {
                if (notes[i].keys.every(k => game.keyboard.isKeyDown(k)))
                {
                    const note = notes[i].music_note;
                    if (!this.playing.includes(note))
                    {
                        this.trumpet?.playNoteDown({program: 56, pitch: note});
                        this.playing.push(note);
                    }
                    // console.log(notes[i]);
                    // // synth.triggerAttack(this.notes[i].music_note);
                    // trumpet?.stop();
                    // trumpet?.play(notes[i].music_note, undefined)
                    // console.log(notes[i].music_note)
                    break;
                }
            }

        }
        else if (game.keyboard.isKeyDown(Key.Digit0))
        {
            game.setScene(new MainMenuScene(game));
        }
        else
        {
            // this.trumpet?.stop();
            this.playing.forEach(value => {
                this.trumpet?.playNoteUp({program: 56, pitch: value})
            })
            this.playing = [];
        }
    }
}


async function loadTrumpet(): Promise<SoundFontPlayer>
{
    const player = new SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
    await player.loadAllSamples(56);
    Log.info("trumpet loaded");
    return player;

    // player.playNoteDown({program: 56, pitch: 60})
    // player.playNoteUp({program: 56, pitch: 60})
}
