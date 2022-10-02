import { Entity, Game, Scene, Sprite, SpriteSheet, Mouse, Component, TextDisp, GlobalSystem } from "lagom-engine";
import {NotePlayer} from "./midi/NotePlay";
import {switzerland} from "./midi/Songs";
import {Song, SongLoader, SongStarter} from "./midi/PlaySong";
import background from "./art/bg.png";
import note from "./art/note.png";
import note_sustain from "./art/note-sustain.png";

import note_tail from "./art/note-tail.png";
import {createNote} from "./notes";

export enum Layers
{
    Background,
    Notes,
    GUI
}

export const screenWidth = 480;
export const screenHeight = 320;

export class LD51 extends Game
{
    constructor()
    {
        super({ width: screenWidth, height: screenHeight, resolution: 2, backgroundColor: 0x202020 });

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
            const duration = Math.floor(Math.random() * 80);

            createNote(this, coinflip, bar, position, duration);
        }

        this.addGlobalSystem(new NotePlayer());

        this.addGUIEntity(new Entity("restartButton", 0, 0, Layers.GUI))
            .addComponent(new RestartButton());

        this.addGlobalSystem(new ClickListener());

        this.addSystem(new SongLoader());
        this.addSystem(new SongStarter());

        const e = this.addEntity(new Entity("switzerland"));
        e.addComponent(new Song(switzerland, 3));
    }
}

class ClickAction extends Component
{
    constructor(readonly action: number)
    {
        super();
    }

    onAction()
    {
        switch (this.action)
        {
            // Start game
            case 0:
                {
                    console.log("Start game");
                    const game = this.getScene().getGame();
                    game.setScene(new MainScene(game));
                    break;
                }
        }
    }
}

class ClickListener extends GlobalSystem
{
    types = () => [ClickAction];

    update(delta: number): void
    {
        this.runOnComponents((actions: ClickAction[]) =>
        {
            if (this.getScene().getGame().mouse.isButtonPressed(0))
            {
                for (const action of actions)
                {
                    action.onAction();
                    //button.destroy();
                }
            }
        });
    }
}

export class MainMenuScene extends Scene
{

    onAdded()
    {
        super.onAdded();
        this.addGUIEntity(new Entity("gameNameText"))
            .addComponent(new TextDisp(screenWidth / 4, screenHeight / 4, "SNIP SNAP 2", { fill: "white", fontSize: 40 }));

        this.addGUIEntity(new Entity("playButton"))
            .addComponent(new PlayButton());

        this.addGlobalSystem(new ClickListener());
    }

}

class PlayButton extends TextDisp
{
    constructor()
    {
        super(screenWidth / 4 + 10, screenHeight / 2, "CLICK TO START GAME", { fill: "white", fontSize: 20 });
    }

    onAdded()
    {
        super.onAdded();
        this.getEntity().addComponent(new ClickAction(0));
    }
}

// Todo make restart sprite in top corner or something
class RestartButton extends TextDisp
{

    constructor()
    {
        const restartButtonX = screenWidth - 80;
        const restartButtonY = 10;
        super(restartButtonX, restartButtonY, "Press 0 to restart", { fill: "white", fontSize: 10 });
    }

    onAdded()
    {
        super.onAdded();
        this.getEntity().addComponent(new ClickAction(1));
    }
}

