import {Entity, Game, Scene, Sprite, SpriteSheet} from "lagom-engine";
import {NotePlayer} from "./midi/NotePlay";

import background from "./art/bg.png";
import note from "./art/note.png";
import note_sustain from "./art/note-sustain.png";

import note_tail from "./art/note-tail.png";
import {createNote, getHighNoteSprite, getLowNoteSprite} from "./notes";

export enum Layers
{
    Background,
    Notes,
    GUI
}

export class LD51 extends Game
{
    constructor()
    {
        super({width: 480, height: 320, resolution: 2, backgroundColor: 0x202020});

        this.addResource("background", new SpriteSheet(background, 480, 320));
        this.addResource("note", new SpriteSheet(note, 14, 15));
        this.addResource("note-sustain", new SpriteSheet(note_sustain, 1, 5));
        this.addResource("note-tail", new SpriteSheet(note_tail, 4, 5));

        this.resourceLoader.loadAll().then(() => {
            this.setScene(new MainScene(this));
        });
    }

}


class MainScene extends Scene
{
    onAdded()
    {
        super.onAdded();

        const background = this.addEntity(new Entity("background", 0, 0, Layers.Background));
        background.addComponent(new Sprite(this.game.getResource("background").textureFromIndex(0)));

        // Entity for each of the 7 bars
        const bars = [];
        for (let i = 1; i <= 7; i++) {
            const bar = this.addEntity(new Entity("notes", 240, 40 * i, Layers.Background));
            bars.push(bar);
        }

        // Add some random notes to the bars.
        for (let i = 0; i < 10; i++) {
            const bar = bars[Math.floor(Math.random() * 7)];
            const position = Math.floor(Math.random() * 240);
            const coinflip = Math.floor(Math.random() * 2);
            const sprite = coinflip === 0 ? getLowNoteSprite(this) : getHighNoteSprite(this);

            createNote(bar, position, 1, sprite);
        }

        this.addGlobalSystem(new NotePlayer());

    }
}