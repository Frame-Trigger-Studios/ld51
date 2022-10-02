import {Entity, Game, Scene} from "lagom-engine";
import {NotePlayer} from "./midi/NotePlay";
import {hbd} from "./midi/Songs";
import {PlaySong, Song, SongManager} from "./midi/PlaySong";

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

        this.addSystem(new SongManager());

        const e = this.addEntity(new Entity("hbd"));
        e.addComponent(new Song(hbd, 0));
        e.addComponent(new PlaySong());
    }
}
