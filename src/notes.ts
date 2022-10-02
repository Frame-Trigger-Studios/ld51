import {Scene, Sprite, SpriteConfig} from "lagom-engine";

const noteConfig: SpriteConfig = {
    xOffset: -7,
    yOffset: -7
};

export const getLowNote = (scene: Scene) => new Sprite(scene.game.getResource("note").texture(0, 0), noteConfig);
export const getHighNote = (scene: Scene) => new Sprite(scene.game.getResource("note").texture(1, 0), noteConfig);
