import {Entity, Scene, Sprite, SpriteConfig} from "lagom-engine";
import {Layers} from "./LD51";

const noteConfig: SpriteConfig = {
    xOffset: -7,
    yOffset: -7
};

export const getLowNoteSprite = (scene: Scene) => new Sprite(scene.game.getResource("note").texture(0, 0), noteConfig);
export const getHighNoteSprite = (scene: Scene) => new Sprite(scene.game.getResource("note").texture(1, 0), noteConfig);

export const createNote = (bar: Entity, position: number, duration: number, note: Sprite) => {
    const child = bar.addChild(new Entity("note1", position, 0, Layers.Notes));
    child.addComponent(note);
};