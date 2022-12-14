import {Entity, GlobalSystem, Key, Sprite, System, Timer} from "lagom-engine";
import {Layers, Trumpets} from "../LD51";
import {lowerNotes, Note, upperNotes} from "../midi/NotePlay";
import {DestroyMeNextFrame} from "../util/DestroyMeNextFrame";

export class BarHighlighter extends GlobalSystem {


    addNoteHighlight = (isLower: boolean, position: number): void => {
        const scene = this.getScene();

        let circlePosition = position;
        if (position < 4) circlePosition += 1;

        const highlightEntity = scene.addEntity(new Entity("highlight", 228, 28 + ((7 - circlePosition) * 40), Layers.Background));
        const ringEntity = scene.addEntity(new Entity("highlight", 226, 26 + ((7 - circlePosition) * 40), Layers.Background));
        if (isLower) {
            ringEntity.addComponent(new Sprite(scene.game.getResource("selected-ring").texture(0, 0)));
            highlightEntity.addComponent(new Sprite(scene.game.getResource("selected-combo").texture(0, 0)));
        } else {
            ringEntity.addComponent(new Sprite(scene.game.getResource("selected-ring").texture(1, 0)));
            highlightEntity.addComponent(new Sprite(scene.game.getResource("selected-combo").texture(0, 0)));
        }
        highlightEntity.addComponent(new DestroyMeNextFrame());
        ringEntity.addComponent(new DestroyMeNextFrame());

        let trumpets = (this.getScene().getEntityWithName("trumpets") as Trumpets).amount

        for (let i = -1; i < trumpets; i++) {

            if (i > 11) {
                i -= 16;
            }

            let xoffset = 0;
            let yoffset = 25*i;
            if (i % 2 === 0) {
                xoffset = 40;
                yoffset += 6;
            }

            // let offset = 35*i

            let config = {}
            let dootx = 110
            let dooty = 232
            if (!isLower) {
                dootx = 88
                dooty = 180
                config = {
                    rotation: -0.5,
                    xOffset: -20
                }
            }

            const trumpet = scene.addEntity(new Entity("trumpet", xoffset, 250 - yoffset, Layers.Background));
            trumpet.addComponent(new Sprite(scene.game.getResource("trumpet").texture(position, 0), config));
            trumpet.addComponent(new DestroyMeNextFrame());

            if (scene.game.keyboard.isKeyDown(Key.Space)) {
                const doot = scene.addEntity(new Entity("doot", dootx + xoffset, dooty - yoffset, Layers.Background));
                doot.addComponent(new Sprite(scene.game.getResource("trumpet-doot").texture(1, 0), config));
                doot.addComponent(new DestroyMeNextFrame());
            }
        }


    };

    types = () => [];

    update(delta: number): void {
        const game = this.getScene().getGame();

        let notes: Note[];
        let highlightLower;
        if (game.keyboard.isKeyDown(Key.ShiftLeft, Key.ShiftRight, Key.Enter)) {
            notes = upperNotes;
            highlightLower = false;
        } else {
            notes = lowerNotes;
            highlightLower = true;
        }

        for (let i = 0; i < notes.length; i++) {

            if (notes[i].keys.every(k => game.keyboard.isKeyDown(k))) {
                this.addNoteHighlight(highlightLower, i);
                break;
            }
        }
    }
}