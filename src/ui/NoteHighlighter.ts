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
        if (game.keyboard.isKeyDown(Key.ShiftLeft, Key.ShiftRight)) {
            notes = upperNotes;
            register = Register.HIGH;
        } else {
            notes = lowerNotes;
            register = Register.LOW;
        }

        const multiplier = this.getScene().getEntityWithName("Score")?.getComponent<ScoreMultiplier>(ScoreMultiplier);
        multiplier?.updateTime(delta);

        this.runOnEntities((entity, noteData) => {

            // noteData.playing = false;

            if (noteData.register !== register) {
                if (game.keyboard.isKeyDown(Key.Space) && multiplier?.outsideHitTolerance()) {
                    Log.info("reset 1")
                    multiplier?.reset();
                }
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

                            this.getScene().getEntityWithName("Score")?.getComponent<Score>(Score)?.addPoints(1);
                            multiplier?.notePlayed(noteData);

                            // Log.info(`${multiplier?.inARow} in a row!`)

                            hitNote = true;

                        }
                        break;
                    }
                }
                if (!hitNote && multiplier?.outsideHitTolerance()) {
                    Log.info("reset 2")
                    multiplier?.reset();
                }
            } else if (game.keyboard.isKeyDown(Key.Space) && multiplier?.outsideHitTolerance()) {
                Log.info("reset 3")
                multiplier?.reset();
            }

            updateNote(this.scene, entity, noteData);
        });
    }
}
