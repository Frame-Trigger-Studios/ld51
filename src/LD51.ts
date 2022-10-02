import {Entity, Game, Scene, Sprite, SpriteSheet} from "lagom-engine";
import {NotePlayer} from "./midi/NotePlay";

import background from "./art/bg.png";


export enum Layers
{
    Background,
    GUI
}

export class LD51 extends Game
{
    constructor()
    {
        super({width: 480, height: 320, resolution: 2, backgroundColor: 0x202020});

        this.addResource("background", new SpriteSheet(background, 480, 320));

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
        background.addComponent(new Sprite(this.game.getResource("background").texture(0, 0)));

        this.addGlobalSystem(new NotePlayer());

    }
}