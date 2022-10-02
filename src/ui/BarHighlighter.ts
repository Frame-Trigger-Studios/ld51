import {Entity, GlobalSystem, Key, Sprite, System, Timer} from "lagom-engine";
import {Layers} from "../LD51";
import {lowerNotes, Note, upperNotes} from "../midi/NotePlay";
import {DestroyMeNextFrame} from "../util/DestroyMeNextFrame";

export class BarHighlighter extends GlobalSystem {

    addNoteHighlight = (isLower: boolean, position: number): void => {
        const scene = this.getScene();

        const highlightEntity = scene.addEntity(new Entity("highlight", 228, 28 + ((6 - position) * 40), Layers.Background));
        const ringEntity = scene.addEntity(new Entity("highlight", 226, 26 + ((6 - position) * 40), Layers.Background));
        if (isLower) {
            ringEntity.addComponent(new Sprite(scene.game.getResource("selected-ring").texture(0, 0)))
            highlightEntity.addComponent(new Sprite(scene.game.getResource("selected-combo").texture(0, 0)))
        } else {
            ringEntity.addComponent(new Sprite(scene.game.getResource("selected-ring").texture(1, 0)))
            highlightEntity.addComponent(new Sprite(scene.game.getResource("selected-combo").texture(0, 0)))
        }
        highlightEntity.addComponent(new DestroyMeNextFrame());
        ringEntity.addComponent(new DestroyMeNextFrame());

    }

    types = () => [];

    update(delta: number): void {
        const game = this.getScene().getGame();

        let notes: Note[];
        let highlightLower;
        if (game.keyboard.isKeyDown(Key.ShiftLeft, Key.ShiftRight)) {
            notes = upperNotes;
            highlightLower = false;
        } else {
            notes = lowerNotes;
            highlightLower = true;
        }

        (game.keyboard.isKeyDown(Key.ShiftLeft, Key.ShiftRight));

        for (let i = 0; i < notes.length; i++) {
            if (notes[i].keys.every(k => game.keyboard.isKeyDown(k))) {
                this.addNoteHighlight(highlightLower, i);
                break;
            }
        }
    }
}