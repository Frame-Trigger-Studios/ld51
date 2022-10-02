import {Component, Key, Log, System} from "lagom-engine";
import {MidiTrack} from "./MidiTypes";
import * as mm from '@magenta/music/es6';
import {SoundFontPlayer} from '@magenta/music/es6';
import switz from './switzerland.mid';

export class Song extends Component
{
    constructor(public readonly track: MidiTrack, readonly primaryChannel: number)
    {
        super();

        Log.debug("primary track name: ", track.tracks[primaryChannel].name);
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
                song.player.start(song.sequence);
            }
        });
    }
}

async function loadSong(song: string): Promise<SongReady>
{
    const sequence = await mm.urlToNoteSequence(song);
    Log.info("MIDI track loaded. Total time is", sequence.totalTime);

    const player = new SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus',
        undefined, undefined, undefined, undefined);

    await player.loadSamples(sequence);
    Log.info("All samples loaded, ready for playback.");

    return new SongReady(player, sequence);
}

export class SongLoader extends System<[Song]>
{
    types = () => [Song];

    update(delta: number): void
    {
        this.runOnEntities((entity, song) => {
            loadSong(switz).then(value => entity.addComponent(value));
            song.destroy();
        });
    }
}
