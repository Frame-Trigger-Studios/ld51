import {Component} from "lagom-engine";
import {Note as Register} from "../notes";

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
    }
}
