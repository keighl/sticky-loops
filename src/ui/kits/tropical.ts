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

class Tropical implements Kitz {
	// Instrument sources
	membrane: Tone.PolySynth
	noise: Tone.NoiseSynth
	piano: Tone.Sampler

	sounds: Record<string, instrumentTrigger> = {
		[STICKY_COLOR_GRAY]: {
			sourceTarget: 'membrane',
			notes: ['A2'],
		},
		[STICKY_COLOR_RED]: {
			sourceTarget: 'membrane',
			notes: ['B2'],
		},
		[STICKY_COLOR_BLUE]: {
			sourceTarget: 'membrane',
			notes: ['C#2'],
		},
		[STICKY_COLOR_ORANGE]: {
			sourceTarget: 'membrane',
			notes: ['D2'],
		},
		[STICKY_COLOR_PINK]: {
			sourceTarget: 'noise',
			notes: ['E2'],
		},
		[STICKY_COLOR_LIGHTGRAY]: {
			sourceTarget: 'piano',
			notes: ['F#2', 'A3', 'C#4'],
		},
		[STICKY_COLOR_TEAL]: {
			sourceTarget: 'membrane',
			notes: ['G#2', 'B3'],
		},
		[STICKY_COLOR_YELLOW]: {
			sourceTarget: 'membrane',
			notes: ['A3'],
		},
		[STICKY_COLOR_VIOLET]: {
			sourceTarget: 'noise',
			notes: ['B3'],
		},
		[STICKY_COLOR_GREEN]: {
			sourceTarget: 'piano',
			notes: ['E2', 'G#3', 'B5'],
		},
	}

	constructor() {
		const delay = new Tone.FeedbackDelay('16n', 0.5).toDestination()

		this.membrane = new Tone.PolySynth(Tone.MembraneSynth).toDestination()
		this.noise = new Tone.NoiseSynth().toDestination()

		this.piano = new Tone.Sampler({
			urls: {
				A1: 'A1.mp3',
			},
			baseUrl: 'https://tonejs.github.io/audio/casio/',
		})
			.connect(delay)
			.toDestination()
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
			membrane: (notes) => {
				this.membrane.triggerAttackRelease(notes, subdivision, time)
			},
			noise: () => {
				this.noise.triggerAttackRelease(subdivision, time)
			},
			piano: (notes) => {
				this.piano.triggerAttackRelease(notes, subdivision, time)
			},
		}

		Object.keys(synthData).forEach((k) => {
			const { notes } = synthData[k]
			sourceMap[k](notes)
		})
	}
}

export default Tropical
