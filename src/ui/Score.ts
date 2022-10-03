import {Component, Entity, System, TextDisp} from "lagom-engine";
import {NoteData} from "./notes";

export let globalScore = "0";
export class Score extends Component
{
    pointsToAdd: number = 0;

    constructor(public points: number) {
        super();
    }

    public addPoints(points: number) {
        this.pointsToAdd += points
    }

    public getScoreText(): string
    {
        return `${this.points} Points`;
    }
}

export class ScoreDisplay extends Entity
{
    constructor(x: number, y: number, depth: number) {
        super("Score", x, y, depth);
    }

    onAdded()
    {
        super.onAdded();
        const score = this.addComponent(new Score(0));
        const multiplier = this.addComponent(new ScoreMultiplier());
        const text = score.getScoreText() + "    " + multiplier.getText();
        this.addComponent(new TextDisp(10, 8, text, {
            fontSize: 10,
            fill: 0xf6cd26
        }));
    }
}

const HIT_TIME_TOLERANCE_MS = 1000;

export class ScoreMultiplier extends Component {
    lastNoteIndex: number = -1;
    inARow: number = 0;
    timeSinceLastNote: number = 0;

    multiplier_points: number = 0;
    multiplier_pointsToAdd: number = 0;

    reset = () => {
        // this.multiplier_pointsToAdd += this.multiplier_points * this.inARow;
        // console.log(this.multiplier_pointsToAdd);
        this.multiplier_points = 0;

        this.lastNoteIndex = -1;
        this.inARow = 0;
        this.timeSinceLastNote = 0;
    }

    notePlayed = (noteData: NoteData) => {
        if (this.lastNoteIndex != noteData.trackPosition) {
            this.inARow++
        } else if (this.lastNoteIndex == -1) {
            this.inARow = 1;
        }
        this.lastNoteIndex = noteData.trackPosition;
        this.timeSinceLastNote = 0;
        // this.multiplier_points++;
        this.multiplier_pointsToAdd += this.inARow;
        // console.log(this.multiplier_pointsToAdd);
    }

    outsideHitTolerance = () => {
        return this.timeSinceLastNote > HIT_TIME_TOLERANCE_MS
    }

    updateTime = (delta: number) => {
        this.timeSinceLastNote += delta;
    }

    getText = () => {
        return `x${this.inARow}`
    }

}

export class ScoreUpdater extends System<[Score, TextDisp, ScoreMultiplier]>
{
    types = () => [Score, TextDisp, ScoreMultiplier];

    update(delta: number)
    {
        this.runOnEntities((entity, score, text1, multiplier) => {
            // if (score.pointsToAdd > 0 || multiplier.multiplier_pointsToAdd > 0)
            // {
                score.points += score.pointsToAdd + multiplier.multiplier_pointsToAdd;
                score.pointsToAdd = 0;
                multiplier.multiplier_pointsToAdd = 0;
                // uh
                globalScore = score.getScoreText();
                text1.pixiObj.text = score.getScoreText() + "    " + multiplier.getText();
            // }
        });
    }
}
