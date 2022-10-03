import {
    Entity,
    Game,
    Scene,
    Sprite,
    SpriteSheet,
    Component,
    TextDisp,
    GlobalSystem,
    TimerSystem,
    Log, LogLevel, Diagnostics, ScreenShaker, Timer, Key
} from "lagom-engine";
import {NotePlayer} from "./midi/NotePlay";
import {LoadSong, NoteMover, NoteSpawner, songHasEnded, SongLoader, SongStarter} from "./midi/PlaySong";
import background from "./art/bg.png";
import note from "./art/note.png";
import note_sustain from "./art/note-sustain.png";
import note_sustain_shadow from "./art/note-sustain-shadow.png";
import selected_combo from "./art/selected.png";
import selected_ring from "./art/rings.png";
import trumpet from "./art/trumpet.png";
import trumpet_beep from "./art/trumpet-beep.png";
import end_card from "./art/end-card.png";
import title from "./art/title.png";

import note_tail from "./art/note-tail.png";
import {createNote, Register, NoteData} from "./ui/notes";
import {switzerland} from "./midi/Songs";
import {BarHighlighter} from "./ui/BarHighlighter";
import {DestroySystem} from "./util/DestroyMeNextFrame";
import {NoteHighlighter} from "./ui/NoteHighlighter";
import {globalScore, Score, ScoreDisplay, ScoreMultiplier, ScoreUpdater} from "./ui/Score";
import {SoundFontPlayer} from '@magenta/music/es6';

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
    static debug = false;

    constructor()
    {
        super({ width: screenWidth, height: screenHeight, resolution: 2, backgroundColor: 0x202020 });

        this.addResource("background", new SpriteSheet(background, 480, 320));
        this.addResource("title", new SpriteSheet(title, 480, 320));
        this.addResource("note", new SpriteSheet(note, 16, 17));
        this.addResource("note-sustain", new SpriteSheet(note_sustain, 1, 4));
        this.addResource("note-sustain-shadow", new SpriteSheet(note_sustain_shadow, 1, 1));
        this.addResource("note-tail", new SpriteSheet(note_tail, 4, 5));
        this.addResource("selected-combo", new SpriteSheet(selected_combo, 24, 24));
        this.addResource("selected-ring", new SpriteSheet(selected_ring, 28, 28));
        this.addResource("trumpet", new SpriteSheet(trumpet, 105, 50));
        this.addResource("trumpet-doot", new SpriteSheet(trumpet_beep, 29, 43));
        this.addResource("end-card", new SpriteSheet(end_card, 480, 320))

        this.resourceLoader.loadAll().then(() => {
            this.setScene(new MainMenuScene(this));
        });
    }

}

export class Trumpets extends Entity {
    constructor(public amount: number) {
        super("trumpets");
    }
}

export class MainScene extends Scene
{
    // vomit
    static song: SoundFontPlayer | undefined = undefined;

    onAdded()
    {
        super.onAdded();

        const background = this.addEntity(new Entity("background", 0, 0, Layers.Background));
        background.addComponent(new Sprite(this.game.getResource("background").textureFromIndex(0)));

        // Entity for each of the 7 bars
        const bars = [];
        for (let i = 7; i > 0; i--) {
            const bar = this.addEntity(new Entity(`bar_${i}`, 240, 40 * i, Layers.Notes));
            bars.push(bar);
        }

        // // Add some random notes to the bars.
        // for (let i = 0; i < 10; i++) {
        //     const bar = bars[Math.floor(Math.random() * 7)];
        //     const position = Math.floor(Math.random() * 240);
        //     const register = Math.floor(Math.random() * 2);
        //     const duration = Math.ceil(Math.random() * 80);
        //
        //     const note = new NoteData(register, duration, false);
        //     createNote(this, note, bar, position);
        // }
        //
        // // Playing note.
        // const note = new NoteData(Register.LOW, 50, true);
        // createNote(this, note, bars[0], 0);

        Log.logLevel = LogLevel.NONE;
        if (LD51.debug) {
            Log.logLevel = LogLevel.ALL;
            const debugInfo = this.addGUIEntity(new Diagnostics("white", 8, true));
            debugInfo.transform.x = 0;
            debugInfo.transform.y = 100;
        }

        this.addGlobalSystem(new NotePlayer());

        this.addGUIEntity(new Entity("restartText", 0, 0, Layers.GUI))
            .addComponent(new RestartText());

        this.addGUIEntity(new ScoreDisplay(0, 0, Layers.GUI));

        // this.addGlobalSystem(new MainMenuClickListener());
        this.addGlobalSystem(new TimerSystem());
        this.addGlobalSystem(new ScreenShaker(screenWidth / 2, screenHeight / 2));

        this.addSystem(new SongLoader());
        this.addSystem(new DestroySystem());
        this.addSystem(new SongStarter());
        this.addSystem(new NoteSpawner(bars));
        this.addSystem(new NoteMover());
        this.addSystem(new NoteHighlighter());
        this.addSystem(new ScoreUpdater());

        this.addGlobalSystem(new EndSystem());

        let trumpets = this.addEntity(new Trumpets(0))
        this.addGlobalSystem(new BarHighlighter());


        const timer = this.addEntity(new Entity("10sTimer"));
        timer.addComponent(new Timer(10000, null, true)).onTrigger.register(() => {
            Log.info("10s timer triggered");
            const multiplier = this.getEntityWithName("Score")?.getComponent<ScoreMultiplier>(ScoreMultiplier);
            if (multiplier) {
                multiplier.inARow += 10;
            }

            const alert = this.addEntity(new Entity("10sAlert", this.camera.width/2 - 80, 0, Layers.GUI));
            alert.addComponent(new TextDisp(10, 8, "10s Alert: 10x multiplier added!", {
                fontSize: 10,
                fill: 0xf6cd26
            }));

            trumpets.amount += 1;

            alert.addComponent(new Timer(2000, alert, false)).onTrigger.register((o) => o.payload.destroy());
        })

        const e = this.addEntity(new Entity("switzerland"));
        e.addComponent(new LoadSong(switzerland, 3));
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
        const game = this.getScene().getGame();
        switch (this.action)
        {
            // Start game
            case 0:
                {
                    game.setScene(new MainScene(game));
                    break;
                }
            // // Restart
            // case 1:
            // {
            //     console.log("restart game");
            //     game.setScene(new MainMenuScene(game));
            //     break;
            // }
        }
    }
}

class MainMenuClickListener extends GlobalSystem
{
    types = () => [ClickAction];

    update(delta: number): void
    {
        this.runOnComponents((actions: ClickAction[]) =>
        {
            if (this.getScene().getGame().keyboard.isKeyPressed(Key.Space))
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
        const title = this.addEntity(new Entity("title", 0, 0, Layers.Background));
        title.addComponent(new Sprite(this.game.getResource("title").textureFromIndex(0)));
        title.addComponent(new ClickAction(0));

        this.addGlobalSystem(new MainMenuClickListener());
    }

}

export class EndScene extends Scene
{
    onAdded()
    {
        super.onAdded();
        const endCard = this.addEntity(new Entity("end-card"));
        endCard.addComponent(new Sprite(this.game.getResource("end-card").texture(0, 0)));
        endCard.addComponent(new TextDisp(screenWidth / 4 + 10, screenHeight / 2 - 50, "Well done! You earned:", { fill: 0xf6cd26, fontSize: 20 }));
        endCard.addComponent(new TextDisp(screenWidth / 4 + 10, screenHeight / 2, globalScore, { fill: 0xf6cd26, fontSize: 30 }));
    }
}

class EndSystem extends GlobalSystem
{
    types = () => [];

    update(delta: number): void {
        if (songHasEnded) {
            const game = this.getScene().getGame();
            game.setScene(new EndScene(game));
        }
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
class RestartText extends TextDisp
{
    constructor()
    {
        const restartX = screenWidth - 87;
        const restartY = 10;
        super(restartX, restartY, "Press '0' to restart", { fill: 0xf6cd26, fontSize: 10 });
    }

    onAdded()
    {
        super.onAdded();
        this.getEntity().addComponent(new ClickAction(1));
    }
}

