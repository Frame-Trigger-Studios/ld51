import {Entity, Scene, Sprite, SpriteConfig} from "lagom-engine";
import {Layers} from "./LD51";

export enum Note {
    LOW,
    HIGH
}

export const getNoteSprite = (scene: Scene, note: Note): Sprite => {
    return new Sprite(scene.game.getResource("note").texture(note, 0), {xOffset: -7, yOffset: -7});
};

export const getNoteSustainSprite = (scene: Scene, note: Note, duration: number): Sprite => {
    return new Sprite(scene.game.getResource("note-sustain").texture(note, 0), {
        xScale: duration,
        xOffset: 7,
        yOffset: -2
    });
};

export const getNoteTailSprite = (scene: Scene, duration: number) => {
    return new Sprite(scene.game.getResource("note-tail").texture(0, 0), {
        xOffset: 7 + duration,
        yOffset: -2
    });
};


export const createNote = (scene: Scene, note: Note, bar: Entity, position: number, duration = 1) => {

    const child = bar.addChild(new Entity("note", position, 0, Layers.Notes));
    child.addComponent(getNoteSprite(scene, note));

    // Sustains
    if (duration === 0) {
        throw Error("no");
    } else if (duration === 1) {
        // No tail
    } else {
        child.addComponent(getNoteSustainSprite(scene, note, duration));
        child.addComponent(getNoteTailSprite(scene, duration));
    }
};