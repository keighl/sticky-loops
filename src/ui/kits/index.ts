import * as Tone from 'tone'

const STICKY_COLOR_GRAY = '#AFBCCF'
const STICKY_COLOR_RED = '#FFAFA3'
const STICKY_COLOR_BLUE = '#80CAFF'
const STICKY_COLOR_ORANGE = '#FFC470'
const STICKY_COLOR_PINK = '#FFBDF2'
const STICKY_COLOR_LIGHTGRAY = '#E6E6E6'
const STICKY_COLOR_TEAL = '#75D7F0'
const STICKY_COLOR_YELLOW = '#FFD966'
const STICKY_COLOR_VIOLET = '#D9B8FF'
const STICKY_COLOR_GREEN = '#85E0A3'

type instrumentTrigger = {
	sourceTarget: string
	notes: Tone.Unit.Frequency[]
}

export interface Kitz {
	trigger(sounds: string[], time: Tone.Unit.Time): void
	sounds: Record<string, instrumentTrigger>
}

class Kit implements Kitz {
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
		console.log('construct')

		this.membrane = new Tone.PolySynth(Tone.MembraneSynth).toDestination()
		this.noise = new Tone.NoiseSynth().toDestination()

		this.piano = new Tone.Sampler({
			urls: {
				A1: 'A1.mp3',
				A2: 'A2.mp3',
			},
			baseUrl: 'https://tonejs.github.io/audio/casio/',
		}).toDestination()
	}

	trigger(sounds: string[], time: Tone.Unit.Time) {
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
				this.membrane.triggerAttackRelease(notes, '8n', time)
			},
			noise: (notes) => {
				this.noise.triggerAttackRelease('8n', time)
			},
			piano: (notes) => {
				this.piano.triggerAttackRelease(notes, '4n', time)
			},
		}

		Object.keys(synthData).forEach((k) => {
			const { notes } = synthData[k]
			sourceMap[k](notes)
		})
	}
}

export default Kit
