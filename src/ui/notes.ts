import {Component, Entity, Scene, Sprite} from "lagom-engine";
import {Layers} from "../LD51";

export enum Register {
    LOW,
    HIGH
}

export class NoteData extends Component {
    constructor(public note: Register,
                public duration: number = 1,
                public playing: boolean) {
        super();
    }
}

class NoteSprite extends Sprite {}
class NoteSustainSprite extends Sprite {}
class NoteTailSprite extends Sprite {}

export const getNoteSprite = (scene: Scene, note: NoteData): Sprite => {
    return new NoteSprite(scene.game.getResource("note").texture(note.note + 2, 0), {
        xOffset: -8, yOffset: -8
    });
};

export const getNoteSustainSprite = (scene: Scene, note: NoteData): Sprite => {

    let note_index: number;
    if (note.note === Register.LOW) {
        if (note.playing) {
            note_index = 2;
        } else {
            note_index = 0;
        }
    } else {
        if (note.playing) {
            note_index = 3;
        } else {
            note_index = 1;
        }
    }

    return new NoteSustainSprite(scene.game.getResource("note-sustain").texture(note_index, 0), {
        xScale: note.duration,
        // xOffset: 7,
        xOffset: 3,
        yOffset: -2
    });
};

const getNoteSustainShadowSprite = (scene: Scene, note: NoteData): Sprite => {
    return new Sprite(scene.game.getResource("note-sustain-shadow").texture(0, 0), {
        xScale: note.duration,
        xOffset: 6,
        yOffset: 2
    })
}

export const getNoteTailSprite = (scene: Scene, note: NoteData) => {

    let note_index: number;
    if (note.note === Register.LOW) {
        if (note.playing) {
            note_index = 2;
        } else {
            note_index = 0;
        }
    } else {
        if (note.playing) {
            note_index = 3;
        } else {
            note_index = 1;
        }
    }

    return new NoteTailSprite(scene.game.getResource("note-tail").texture(note_index, 0), {
        xOffset: 3 + note.duration,
        yOffset: -2
    });
};

export const createNote = (scene: Scene, note: NoteData, bar: Entity, position: number) => {

    const child = bar.addChild(new Entity("note", position, 0, Layers.Notes));
    child.addComponent(note);
    child.addComponent(getNoteSprite(scene, note));

    // const tail = child.addChild(new Entity("tail", 0, 0, Layers.Note_Tails));

    // Sustains
    if (note.duration === 0) {
        throw Error("no");
    } else if (note.duration === 1) {
        // No tail
    } else {
        child.addComponent(getNoteSustainSprite(scene, note));
        child.addComponent(getNoteSustainShadowSprite(scene, note));
        child.addComponent(getNoteTailSprite(scene, note));
    }

    return child;
};

// export const playNote = (scene: Scene, entity: Entity, note: Note) => {
//
//     const noteSustainSprite = entity.getComponent(NoteSustainSprite);
//
//     if (noteSustainSprite !== null) {
//         note.removeComponent(noteSustainSprite, true);
//     }
//
//     note.addComponent(getNoteTailSprite(scene, ));
//
// };
