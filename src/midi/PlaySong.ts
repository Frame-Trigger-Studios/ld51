import {Component, Key, Log, System} from "lagom-engine";
import * as Tone from "tone";
import {MidiTrack} from "./MidiTypes";


export class Song extends Component
{

    constructor(public readonly track: MidiTrack, readonly primaryChannel: number)
    {
        super();
    }

    onAdded()
    {
        super.onAdded();
    }

}

export class PlaySong extends Component
{
}

export class IsPlaying extends Component
{
}

export class SongStarter extends System<[Song]>
{
    types = () => [Song];

    update(delta: number): void
    {
        this.runOnEntities((entity, song) => {
            if (entity.scene.game.keyboard.isKeyPressed(Key.Space) && entity.getComponent(PlaySong) === null
                && entity.getComponent(IsPlaying) === null)
            {
                entity.addComponent(new PlaySong());
                entity.addComponent(new IsPlaying());
            }
        });
    }
}


export class SongManager extends System<[Song, PlaySong]>
{
    types = () => [Song, PlaySong];

    update(delta: number): void
    {
        this.runOnEntities((entity, song, playSong) => {
            playSong.destroy();

            Log.debug("playing song");

            const synths = [];
            song.track.tracks.forEach((track) => {
                const synth = new Tone.PolySynth(Tone.Synth, {
                    envelope: {
                        attack: 0.02,
                        decay: 0.1,
                        sustain: 0.3,
                        release: 1,
                    }
                }).toDestination();
                synths.push(synth);
                const now = Tone.now() + 0.5;
                track.notes.forEach((note) => {
                    synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity);
                });
            });
        });
    }
}
