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
import { instrumentTrigger, KitTriggerOptions, Kitz } from '../constants'

class Drum implements Kitz {
	// Instrument sources
	drumSampler: Tone.Sampler

	sounds: Record<string, instrumentTrigger> = {
		[STICKY_COLOR_GRAY]: {
			sourceTarget: 'drums',
			notes: ['C2'],
		},
		[STICKY_COLOR_RED]: {
			sourceTarget: 'drums',
			notes: ['D2'],
		},
		[STICKY_COLOR_BLUE]: {
			sourceTarget: 'drums',
			notes: ['E2'],
		},
		[STICKY_COLOR_ORANGE]: {
			sourceTarget: 'drums',
			notes: ['F2'],
		},
		[STICKY_COLOR_PINK]: {
			sourceTarget: 'drums',
			notes: ['G2'],
		},
		[STICKY_COLOR_LIGHTGRAY]: {
			sourceTarget: 'drums',
			notes: ['A2'],
		},
		[STICKY_COLOR_TEAL]: {
			sourceTarget: 'drums',
			notes: ['C2'],
		},
		[STICKY_COLOR_YELLOW]: {
			sourceTarget: 'drums',
			notes: ['D2'],
		},
		[STICKY_COLOR_VIOLET]: {
			sourceTarget: 'drums',
			notes: ['E2'],
		},
		[STICKY_COLOR_GREEN]: {
			sourceTarget: 'drums',
			notes: ['F2'],
		},
	}

	constructor() {
		const delay = new Tone.FeedbackDelay('16n', 0.5).toDestination()

		this.drumSampler = new Tone.Sampler({
			urls: {
				C2: 'kick.mp3',
				D2: 'snare.mp3',
				E2: 'hihat.mp3',
				F2: 'tom1.mp3',
				G2: 'tom2.mp3',
				A2: 'tom3.mp3',
			},
			baseUrl: 'https://tonejs.github.io/audio/drum-samples/Stark/',
		}).toDestination()
	}

	trigger({ sounds, time, subdivision }: KitTriggerOptions) {
		const synthData = sounds.reduce<
			Record<string, { notes: Tone.Unit.Frequency[] }>
		>((results, sound) => {
			const instrument = this.sounds[sound]
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
