import {Game, Scene} from "lagom-engine";

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


    }
}