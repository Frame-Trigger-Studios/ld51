import {Key, Log, System} from "lagom-engine";
import {NoteData, Register, updateNote} from "./notes";
import {lowerNotes, Note, upperNotes} from "../midi/NotePlay";
import {Score, ScoreMultiplier} from "./Score";

const HIT_TOLERANCE = 5;

export class NoteHighlighter extends System<[NoteData]> {
    types = () => [NoteData];

    update(delta: number): void {
        const game = this.getScene().getGame();

        let notes: Note[];
        let register: Register;
        if (game.keyboard.isKeyDown(Key.ShiftLeft, Key.ShiftRight, Key.Enter)) {
            notes = upperNotes;
            register = Register.HIGH;
        } else {
            notes = lowerNotes;
            register = Register.LOW;
        }

        const scoreEntity = this.getScene().getEntityWithName("Score");
        const score = scoreEntity?.getComponent<Score>(Score);
        const multiplier = scoreEntity?.getComponent<ScoreMultiplier>(ScoreMultiplier);

        multiplier?.updateTime(delta);

        this.runOnEntities((entity, noteData) => {

            if (noteData.register !== register) {
                return;
            }

            if (entity.transform.x < HIT_TOLERANCE && entity.transform.x > -HIT_TOLERANCE) {
                let hitNote = false;
                for (let i = 0; i < notes.length; i++) {
                    if (notes[i].keys.every(k => game.keyboard.isKeyDown(k))) {

                        let index = i;
                        if (index > 3) index -= 1;

                        if (noteData.noteId === index && game.keyboard.isKeyDown(Key.Space)) {
                            noteData.playing = true;

                            score?.addPoints((delta/20));
                            multiplier?.notePlayed(noteData);

                            hitNote = true;

                        }
                        break;
                    }
                }
            }

            updateNote(this.scene, entity, noteData);
        });

    }
}
