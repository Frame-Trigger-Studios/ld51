import {Game, Scene} from "lagom-engine";
import {NotePlayer} from "./midi/NotePlay";
import {hbd} from "./midi/Hbd";
import {Midi} from "tone";

export class LD51 extends Game
{
    constructor()
    {
        super({width: 800, height: 600, resolution: 1, backgroundColor: 0x000000});
        this.setScene(new MainScene(this));
    }
}

const b64toBlob = (base64: string, type = 'application/octet-stream') =>
    fetch(`data:${type};base64,${base64}`).then(res => res.blob());


class MainScene extends Scene
{
    onAdded()
    {
        super.onAdded();
        this.addGlobalSystem(new NotePlayer());


        const midi = Midi.

    }
}