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
	hit: 'B1',
	hihat_1: 'C1',
	hihat_2: 'D1',
	tom_low: 'E1',
	clap: 'F1',
	click: 'G1',
	bleep: 'A2',
	noise: 'A3',
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
			notes: [midiMap.hit],
		},
		[STICKY_COLOR_ORANGE]: {
			sourceTarget: 'drums',
			notes: [midiMap.hihat_1],
		},
		[STICKY_COLOR_PINK]: {
			sourceTarget: 'drums',
			notes: [midiMap.hihat_2],
		},
		[STICKY_COLOR_GRAY]: {
			sourceTarget: 'drums',
			notes: [midiMap.noise],
		},
		[STICKY_COLOR_TEAL]: {
			sourceTarget: 'drums',
			notes: [midiMap.tom_low],
		},
		[STICKY_COLOR_YELLOW]: {
			sourceTarget: 'drums',
			notes: [midiMap.click],
		},
		[STICKY_COLOR_VIOLET]: {
			sourceTarget: 'drums',
			notes: [midiMap.clap],
		},
		[STICKY_COLOR_GREEN]: {
			sourceTarget: 'drums',
			notes: [midiMap.bleep],
		},
	}

	constructor() {
		this.drumSampler = new Tone.Sampler({
			urls: {
				[midiMap.kick]: 'kick.wav',
				[midiMap.hit]: 'hit.wav',
				[midiMap.hihat_1]: 'hihat-1.wav',
				[midiMap.hihat_2]: 'hihat-2.wav',
				[midiMap.tom_low]: 'tom-low.wav',
				[midiMap.clap]: 'clap.wav',
				[midiMap.click]: 'click.wav',
				[midiMap.bleep]: 'bleep.wav',
				[midiMap.noise]: 'noise.wav',
			},
			baseUrl: 'https://sticky-loops.netlify.app/space-between/',
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
