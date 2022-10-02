import {Entity, Game, Scene} from "lagom-engine";
import {NotePlayer} from "./midi/NotePlay";
import {switzerland} from "./midi/Songs";
import {Song, SongLoader, SongStarter} from "./midi/PlaySong";

export class LD51 extends Game
{
    constructor()
    {
        super({width: 800, height: 600, resolution: 1, backgroundColor: 0x000000});
        this.setScene(new MainScene(this));
    }
}

class MainScene extends Scene
{
    onAdded()
    {
        super.onAdded();
        this.addGlobalSystem(new NotePlayer());

        this.addSystem(new SongLoader());
        this.addSystem(new SongStarter());

        const e = this.addEntity(new Entity("switzerland"));
        e.addComponent(new Song(switzerland, 3));
    }
}

