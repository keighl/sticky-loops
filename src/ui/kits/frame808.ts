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
import { KIT_FRAME_808 } from '../constants'
import { FSUI } from '../types'
import Kit from './kit'

const midiMap = {
	kick: 'A1',
	snare: 'B1',
	hihat_pedal: 'C1',
	hihat_open: 'D1',
	tom_high: 'E1',
	clap1: 'F1',
	clap2: 'G1',
	shaker: 'A2',
	tambourine: 'A3',
}

const sampleMap: Record<string, FSUI.Kit_SoundTrigger> = {
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
		notes: [midiMap.hihat_pedal],
	},
	[STICKY_COLOR_GRAY]: {
		sourceTarget: 'drums',
		notes: [midiMap.tambourine],
	},
	[STICKY_COLOR_TEAL]: {
		sourceTarget: 'drums',
		notes: [midiMap.tom_high],
	},
	[STICKY_COLOR_YELLOW]: {
		sourceTarget: 'drums',
		notes: [midiMap.tom_high],
	},
	[STICKY_COLOR_VIOLET]: {
		sourceTarget: 'drums',
		notes: [midiMap.clap2],
	},
	[STICKY_COLOR_GREEN]: {
		sourceTarget: 'drums',
		notes: [midiMap.clap1],
	},
}

class Frame808 extends Kit {
	id = KIT_FRAME_808
	drumSampler: Tone.Sampler

	constructor(onLoad: FSUI.KitCallbackLoad, onError: FSUI.KitCallbackError) {
		super(onLoad, onError)
		this.drumSampler = new Tone.Sampler({
			urls: {
				[midiMap.kick]: 'kick.wav',
				[midiMap.snare]: 'snare.wav',
				[midiMap.hihat_pedal]: 'hihat-pedal.wav',
				[midiMap.hihat_open]: 'hihat-open.wav',
				[midiMap.tom_high]: 'tom-high.wav',
				[midiMap.clap1]: 'clap1.wav',
				[midiMap.clap2]: 'clap2.wav',
				[midiMap.shaker]: 'shaker.wav',
				[midiMap.tambourine]: 'tambourine.wav',
			},
			baseUrl: 'https://sticky-loops.netlify.app/frame-808/',
			onload: () => {
				this.soundsLoaded = true
				this.onLoad()
			},
			onerror: (error) => {
				this.onError(error)
			},
		}).toDestination()

		this.drumSampler.volume.value = -6
	}

	trigger({ sounds, time, subdivision }: FSUI.Kit_TriggerOptions) {
		if (!this.soundsLoaded) {
			return
		}

		const synthData = sounds.reduce<
			Record<string, { notes: Tone.Unit.Frequency[] }>
		>((results, sound) => {
			let instrument = sampleMap[sound.color]
			if (!instrument) {
				console.log('No instrument for', sound.color)

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

export default Frame808
