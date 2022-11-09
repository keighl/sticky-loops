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
import { KIT_DOCUMENT_COLORS } from '../constants'
import { FSUI } from '../types'

const midiMap = {
	snare: 'A1',
	ride: 'B1',
	kick: 'C1',
	hihatOpen: 'D1',
	hihatFoot: 'E1',
}

class DocumentColors implements FSUI.Kit {
	id = KIT_DOCUMENT_COLORS
	drumSampler: Tone.Sampler
	pianoSampler: Tone.Sampler
	soundsLoaded: boolean
	drumsLoaded: boolean
	pianoLoaded: boolean

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
			notes: [midiMap.hihatOpen],
		},
		[STICKY_COLOR_PINK]: {
			sourceTarget: 'drums',
			notes: [midiMap.hihatFoot],
		},
		[STICKY_COLOR_GRAY]: {
			sourceTarget: 'drums',
			notes: [midiMap.ride],
		},
		[STICKY_COLOR_TEAL]: {
			sourceTarget: 'piano',
			notes: ['C#4', 'F6', 'A#6'],
		},
		[STICKY_COLOR_YELLOW]: {
			sourceTarget: 'piano',
			notes: ['A#4', 'F4', 'G#5', 'C#5'],
		},
		[STICKY_COLOR_VIOLET]: {
			sourceTarget: 'piano',
			notes: ['C#5', 'F5'],
		},
		[STICKY_COLOR_GREEN]: {
			sourceTarget: 'drums',
			notes: [midiMap.hihatOpen],
		},
	}

	constructor() {
		this.soundsLoaded = false
		this.drumsLoaded = false
		this.pianoLoaded = false

		this.drumSampler = new Tone.Sampler({
			urls: {
				[midiMap.snare]: 'snare.wav',
				[midiMap.ride]: 'ride.wav',
				[midiMap.kick]: 'kick.wav',
				[midiMap.hihatOpen]: 'hihat-open.wav',
				[midiMap.hihatFoot]: 'hihat-foot.wav',
			},
			baseUrl: 'https://sticky-loops.netlify.app/document-colors/',
			onload: () => {
				this.drumsLoaded = true
				this.checkLoad()
			},
		}).toDestination()

		this.pianoSampler = new Tone.Sampler({
			urls: {
				A3: 'A3.mp3',
				A4: 'A4.mp3',
				A5: 'A5.mp3',

				C2: 'C2.mp3',
				C3: 'C3.mp3',
				C4: 'C4.mp3',
				C5: 'C5.mp3',

				'F#3': 'Fs3.mp3',
				'F#4': 'Fs4.mp3',
				'F#5': 'Fs5.mp3',
			},
			baseUrl: 'https://tonejs.github.io/audio/salamander/',
			onload: () => {
				this.pianoLoaded = true
				this.checkLoad()
			},
			onerror: (error) => {
				console.error(error)
			},
		})

		const panner = new Tone.Panner(0.65).toDestination()
		this.pianoSampler.connect(panner)

		this.pianoSampler.volume.value = -7
	}

	checkLoad() {
		this.soundsLoaded = this.pianoLoaded && this.drumsLoaded
	}

	trigger({ sounds, time, subdivision }: FSUI.Kit_TriggerOptions) {
		if (!this.soundsLoaded) {
			return
		}

		const synthData = sounds.reduce<
			Record<string, { notes: Tone.Unit.Frequency[] }>
		>((results, sound) => {
			const instrument = this.sounds[sound.color]
			if (!instrument) {
				// TODO, find closest color?
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
			piano: (notes) => {
				this.pianoSampler.triggerAttackRelease(notes, subdivision, time)
			},
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

export default DocumentColors
