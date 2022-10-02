import {Component, Entity, Key, Log, System, Timer, TimerSystem} from "lagom-engine";
import * as mm from '@magenta/music/es6';
import {SoundFontPlayer} from '@magenta/music/es6';
import {Song} from "./Songs";
import {LeadNote, LeadTrack, SongTime, TrackPosition} from "./PlayableTrack";
import {createNote, Register, NoteData} from "../ui/notes";

export class LoadSong extends Component
{
    constructor(public readonly song: Song, readonly primaryChannel: number)
    {
        super();
    }

    onAdded()
    {
        super.onAdded();
    }

}

export class IsPlaying extends Component
{
}

export class SongReady extends Component
{
    constructor(readonly player: SoundFontPlayer, readonly sequence: mm.NoteSequence)
    {
        super();
    }

}

export class FirstNote extends Component {}

const NOTE_SPEED = 50;

export class SongStarter extends System<[SongReady]>
{
    types = () => [SongReady];

    update(delta: number): void
    {
        this.runOnEntities((entity, song) => {
            if (entity.scene.game.keyboard.isKeyPressed(Key.Space)
                && entity.getComponent(IsPlaying) === null)
            {
                entity.addComponent(new IsPlaying());
                entity.addComponent(new SongTime(0));
                entity.addComponent(new Timer(4450, null, false))
                      .onTrigger.register(() => song.player.start(song.sequence));
            }
        });
    }
}

async function loadSong(song: string): Promise<SongReady>
{
    const sequence = await mm.urlToNoteSequence(song);
    Log.info("MIDI track loaded. Total time is", sequence.totalTime);

    // Max velocity is 127, crush it down to have a max of 20.
    const newMax = 20;

    sequence.notes.forEach(value => {
        value.velocity = (value.velocity as number / 127) * newMax;
    });

    const player = new SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus',
        undefined, undefined, undefined, undefined);

    await player.loadSamples(sequence);
    Log.info("All samples loaded, ready for playback.");

    return new SongReady(player, sequence);
}

const keyLut: Map<string, string> = new Map([
    ["Gb", "F#"],
    ["Ab", "G#"],
    ["Bb", "A#"],
    ["Cb", "B"],
    ["Db", "C#"],
    ["Eb", "D#"],
    ["Fb", "E"],
    ["B#", "C"],
    ["E#", "F"]]);

const noteLut: Map<string, { lowIdx: number, highIdx: number }> = new Map([
    ["F#", {
        lowIdx: 0,
        highIdx: 5
    }],
    ["G", {
        lowIdx: 1,
        highIdx: 6
    }],
    ["G#", {
        lowIdx: 2,
        highIdx: -1
    }],
    ["A", {
        lowIdx: 3,
        highIdx: -1
    }],
    ["A#", {
        lowIdx: 4,
        highIdx: -1
    }],
    ["B", {
        lowIdx: 5,
        highIdx: -1
    }],
    ["C", {
        lowIdx: 6,
        highIdx: -1
    }],
    ["C#", {
        lowIdx: -1,
        highIdx: 0
    }],
    ["D", {
        lowIdx: -1,
        highIdx: 1
    }],
    ["D#", {
        lowIdx: -1,
        highIdx: 2
    }],
    ["E", {
        lowIdx: -1,
        highIdx: 3
    }],
    ["F", {
        lowIdx: -1,
        highIdx: 4
    }]]);

export class SongLoader extends System<[LoadSong]>
{
    types = () => [LoadSong];

    update(delta: number): void
    {
        this.runOnEntities((entity, toLoad) => {

            // Load the actual song so it can be played.
            loadSong(toLoad.song.midi).then(value => entity.addComponent(value));

            // Load the lead track for the player input.
            Log.debug("primary track name: ", toLoad.song.track.tracks[toLoad.primaryChannel].name);
            const notes: LeadNote[] = [];

            const previousTime = -1;
            const previousDuration = -1;

            toLoad.song.track.tracks[toLoad.primaryChannel].notes.forEach(note => {

                // Find anything that started at the same time, drop it.
                if (note.time <= previousTime) {
                    return;
                }

                // Find anything that overlaps, chop the original so it fits in.
                if (previousTime + previousDuration > note.time) {
                    notes.at(notes.length-1)!.duration = note.time - previousTime;
                }

                const noteComps = note.name.match("(.*?)(\\d+)");

                if (noteComps === null)
                {
                    return;
                }

                const noteName = noteComps[1];

                const key = keyLut.get(noteName) || noteName;
                const index = noteLut.get(key) || {lowIdx: 0, highIdx: 0};

                // TODO we can do logic for the two notes that overlap if we want to, we know the octave
                //  with noteComps[2]
                if (index.lowIdx === -1) {
                    notes.push({time: note.time, noteId: index.highIdx, duration: note.duration, register: Register.HIGH});
                } else {
                    notes.push({time: note.time, noteId: index.lowIdx, duration: note.duration, register: Register.LOW});
                }
            });

            entity.addComponent(new LeadTrack(notes));
            entity.addComponent(new SongTime(0));
            entity.addComponent(new TrackPosition(0));
            toLoad.destroy();
            console.log(notes);


            console.log(notes.length)
        });
    }
}

export class NoteSpawner extends System<[LeadTrack, SongTime, IsPlaying, SongReady, TrackPosition]> {
    constructor(private bars: Entity[]) {
        super();
    }

    types = () => [LeadTrack, SongTime, IsPlaying, SongReady, TrackPosition];

    update(delta: number): void {
        this.runOnEntities((entity, leadTrack, songTime, _, Song, position) => {
            const time = songTime.time/1000;

            if (position.pos >= leadTrack.notes.length) {
                // we're done;
                return;
            }

            if (leadTrack.notes[position.pos].time <= time) {
                const note = leadTrack.notes[position.pos]
                const noteData = new NoteData(note.register, note.duration, false);
                const noteEntity = createNote(this.getScene(), noteData, this.bars[note.noteId], 240);
                position.pos++;

                if (position.pos == 0) {
                    noteEntity.addComponent(new FirstNote())
                }
            } else {
                // no notes to spawn at this time
            }
            songTime.time += delta;
        });
    }
}

export class NoteMover extends System<[NoteData]> {
    types = () => [NoteData];

    update(delta: number): void {
        this.runOnEntities((entity, noteData) => {
            entity.transform.x -= NOTE_SPEED * (delta/1000);
        });
    }
}
