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
	cajonBass: 'A1',
	cajonSnare: 'B1',
	castanets: 'C1',
	timbale: 'D1',
	stomp: 'E1',
	maracas: 'F1',
	congaHigh: 'G1',
	congaLow: 'A2',
	claves: 'A3',
}

class CopyAsPNG implements FSUI.Kit {
	// Instrument sources
	drumSampler: Tone.Sampler

	sounds: Record<string, FSUI.Kit_SoundTrigger> = {
		[STICKY_COLOR_LIGHTGRAY]: {
			sourceTarget: 'none',
			notes: [],
		},

		[STICKY_COLOR_RED]: {
			sourceTarget: 'drums',
			notes: [midiMap.cajonBass],
		},
		[STICKY_COLOR_BLUE]: {
			sourceTarget: 'drums',
			notes: [midiMap.cajonSnare],
		},
		[STICKY_COLOR_ORANGE]: {
			sourceTarget: 'drums',
			notes: [midiMap.castanets],
		},
		[STICKY_COLOR_PINK]: {
			sourceTarget: 'drums',
			notes: [midiMap.timbale],
		},
		[STICKY_COLOR_GRAY]: {
			sourceTarget: 'drums',
			notes: [midiMap.stomp],
		},
		[STICKY_COLOR_TEAL]: {
			sourceTarget: 'drums',
			notes: [midiMap.maracas],
		},
		[STICKY_COLOR_YELLOW]: {
			sourceTarget: 'drums',
			notes: [midiMap.congaHigh],
		},
		[STICKY_COLOR_VIOLET]: {
			sourceTarget: 'drums',
			notes: [midiMap.congaLow],
		},
		[STICKY_COLOR_GREEN]: {
			sourceTarget: 'drums',
			notes: [midiMap.claves],
		},
	}

	constructor() {
		this.drumSampler = new Tone.Sampler({
			urls: {
				[midiMap.cajonBass]: 'cajon-bass.wav',
				[midiMap.cajonSnare]: 'cajon-snare.wav',
				[midiMap.castanets]: 'castanets.wav',
				[midiMap.timbale]: 'timbale.wav',
				[midiMap.stomp]: 'stomp.wav',
				[midiMap.maracas]: 'maracas.wav',
				[midiMap.congaHigh]: 'conga-high.wav',
				[midiMap.congaLow]: 'conga-low.wav',
				[midiMap.claves]: 'claves.wav',
			},
			baseUrl: 'https://sticky-loops.netlify.app/copy-as-png/',
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

export default CopyAsPNG
