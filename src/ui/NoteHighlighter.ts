import {Key, System} from "lagom-engine";
import {NoteData, Register, updateNote} from "./notes";
import {lowerNotes, Note, upperNotes} from "../midi/NotePlay";

export class NoteHighlighter extends System<[NoteData]> {
    types = () => [NoteData];

    update(delta: number): void {

        const game = this.getScene().getGame();

        let notes: Note[];
        let register: Register;
        if (game.keyboard.isKeyDown(Key.ShiftLeft, Key.ShiftRight)) {
            notes = upperNotes;
            register = Register.HIGH;
        } else {
            notes = lowerNotes;
            register = Register.LOW;
        }

        this.runOnEntities((entity, noteData) => {

            // noteData.playing = false;

            if (noteData.register !== register) {
                return;
            }

            if (entity.transform.x < 0 && entity.transform.x > -2) {
                for (let i = 0; i < notes.length; i++) {
                    if (notes[i].keys.every(k => game.keyboard.isKeyDown(k))) {

                        let index = i;
                        if (index > 3) index -= 1;

                        if (noteData.noteId === index && game.keyboard.isKeyDown(Key.Space)) {
                            noteData.playing = true;
                        }

                        break;
                    }
                }
            }

            updateNote(this.scene, entity, noteData);
        });
    }
}