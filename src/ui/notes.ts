import {Component, Entity, Scene, Sprite} from "lagom-engine";
import {Layers} from "../LD51";

export enum Register {
    LOW,
    HIGH
}

export class NoteData extends Component {
    constructor(public register: Register,
                public noteId: number,
                public duration: number = 1,
                public playing: boolean,
                public trackPosition: number) {
        super();
    }
}

class NoteSprite extends Sprite {}
class NoteSustainSprite extends Sprite {}
class NoteTailSprite extends Sprite {}

const getNoteIndex = (note: NoteData) => {
    let note_index: number;
    if (note.register === Register.LOW) {
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

    return note_index;
}

export const getNoteSprite = (scene: Scene, note: NoteData): Sprite => {
    return new NoteSprite(scene.game.getResource("note").texture(getNoteIndex(note) + 2, 0), {
        xOffset: -8, yOffset: -8
    });
};

export const getNoteSustainSprite = (scene: Scene, note: NoteData): Sprite => {

    return new NoteSustainSprite(scene.game.getResource("note-sustain").texture(getNoteIndex(note), 0), {
        xScale: note.duration,
        // xOffset: 7,
        xOffset: 3,
        yOffset: -2
    });
};

const getNoteSustainShadowSprite = (scene: Scene, note: NoteData): Sprite => {
    return new Sprite(scene.game.getResource("note-sustain-shadow").texture(getNoteIndex(note), 0), {
        xScale: note.duration,
        xOffset: 6,
        yOffset: 2
    })
}

export const getNoteTailSprite = (scene: Scene, note: NoteData) => {

    return new NoteTailSprite(scene.game.getResource("note-tail").texture(getNoteIndex(note), 0), {
        xOffset: 3 + note.duration,
        yOffset: -2
    });
};

export const createNote = (scene: Scene, note: NoteData, bar: Entity, position: number) => {

    const child = bar.addChild(new Entity("note", position, 0, Layers.Notes));
    child.addComponent(note);

    addNoteSprites(scene, child, note);
    return child;
};

export const updateNote = (scene: Scene, entity: Entity, note: NoteData) => {
    entity.getComponentsOfType(Sprite).forEach(sprite => entity.removeComponent(sprite, true));
    addNoteSprites(scene, entity, note);
}

export const addNoteSprites = (scene: Scene, entity: Entity, note: NoteData) => {
    entity.addComponent(getNoteSprite(scene, note));

    // Sustains
    if (note.duration > 4) {
        entity.addComponent(getNoteSustainSprite(scene, note));
        entity.addComponent(getNoteSustainShadowSprite(scene, note));
        entity.addComponent(getNoteTailSprite(scene, note));
    }

}

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
