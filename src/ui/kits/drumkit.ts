import * as Tone from 'tone'

import {
	STICKY_COLOR_GRAY,
	STICKY_COLOR_RED,
	STICKY_COLOR_BLUE,
	STICKY_COLOR_ORANGE,
	STICKY_COLOR_PINK,
	STICKY_COLOR_LIGHTGRAY,
	STICKY_COLOR_TEAL,
	STICKY_COLOR_YELLOW,
	STICKY_COLOR_VIOLET,
	STICKY_COLOR_GREEN,
} from '../../constants'
import { FSUI } from '../types'

const midiMap = {
	kick: 'A1',
	snare: 'B1',
	hihat_closed: 'C1',
	hihat_open: 'D1',
	tom_low: 'E1',
	tom_mid: 'F1',
	tom_high: 'G1',
	clap: 'A2',
	ride: 'A3',
}

class Drum implements FSUI.Kit {
	// Instrument sources
	drumSampler: Tone.Sampler

	sounds: Record<string, FSUI.Kit_SoundTrigger> = {
		[STICKY_COLOR_LIGHTGRAY]: {
			sourceTarget: 'none',
			notes: [],
		},

		[STICKY_COLOR_RED]: {
			sourceTarget: 'drums',
			notes: [midiMap.kick],
		},
		[STICKY_COLOR_BLUE]: {
			sourceTarget: 'drums',
			notes: [midiMap.snare],
		},
		[STICKY_COLOR_ORANGE]: {
			sourceTarget: 'drums',
			notes: [midiMap.hihat_open],
		},
		[STICKY_COLOR_PINK]: {
			sourceTarget: 'drums',
			notes: [midiMap.hihat_closed],
		},
		[STICKY_COLOR_GRAY]: {
			sourceTarget: 'drums',
			notes: [midiMap.tom_low],
		},
		[STICKY_COLOR_TEAL]: {
			sourceTarget: 'drums',
			notes: [midiMap.tom_mid],
		},
		[STICKY_COLOR_YELLOW]: {
			sourceTarget: 'drums',
			notes: [midiMap.tom_high],
		},
		[STICKY_COLOR_VIOLET]: {
			sourceTarget: 'drums',
			notes: [midiMap.clap],
		},
		[STICKY_COLOR_GREEN]: {
			sourceTarget: 'drums',
			notes: [midiMap.ride],
		},
	}

	constructor() {
		this.drumSampler = new Tone.Sampler({
			urls: {
				[midiMap.kick]: 'kick.mp3',
				[midiMap.snare]: 'snare.mp3',
				[midiMap.hihat_closed]: 'hihat-closed.mp3',
				[midiMap.hihat_open]: 'hihat-open.mp3',
				[midiMap.tom_low]: 'tom-low.mp3',
				[midiMap.tom_mid]: 'tom-mid.mp3',
				[midiMap.tom_high]: 'tom-high.mp3',
				[midiMap.clap]: 'clap.mp3',
				[midiMap.ride]: 'ride.mp3',
			},
			baseUrl: 'https://gogulilango.com/sounds/drum-kits/hiphop/',
		}).toDestination()
	}

	trigger({ sounds, time, subdivision }: FSUI.Kit_TriggerOptions) {
		const synthData = sounds.reduce<
			Record<string, { notes: Tone.Unit.Frequency[] }>
		>((results, sound) => {
			const instrument = this.sounds[sound.color]
			if (!instrument) {
				console.error('No instrument in kit for', sound)

				return results
			}
			return {
				...results,
				[instrument.sourceTarget]: {
					...results[instrument.sourceTarget],
					notes: [
						...(results[instrument.sourceTarget] || { notes: [] }).notes,
						...instrument.notes,
					],
				},
			}
		}, {})

		const sourceMap: Record<string, (notes: Tone.Unit.Frequency[]) => void> = {
			none: () => {},
			drums: (notes) => {
				this.drumSampler.triggerAttackRelease(notes, subdivision, time)
			},
		}

		Object.keys(synthData).forEach((k) => {
			const { notes } = synthData[k]
			sourceMap[k](notes)
		})
	}
}

export default Drum
