import {Component} from "lagom-engine";

export interface LeadNote
{
    time: number,
    duration: number,
    noteId: number,
    register: "low" | "high"
}


export class LeadTrack extends Component
{
    constructor(readonly notes: LeadNote[])
    {
        super();
    }
}
