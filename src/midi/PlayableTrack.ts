import {Component} from "lagom-engine";
import {Register} from "../ui/notes";

export interface LeadNote
{
    time: number,
    duration: number,
    noteId: number,
    register: Register
}

export class SongTime extends Component {
    constructor(public time: number) {
        super();
        this.time = 0;
    }
}

export class TrackPosition extends Component {
    constructor(public pos: number) {
        super();
    }
}


export class LeadTrack extends Component
{
    constructor(readonly notes: LeadNote[])
    {
        super();

        // Remove first note so the start song lag is offset from the first time you have to play.
        notes.shift();
    }
}
