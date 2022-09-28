import * as Tone from 'tone'

export type instrumentTrigger = {
	sourceTarget: string
	notes: Tone.Unit.Frequency[]
}

export interface Kitz {
	trigger(sounds: string[], time: Tone.Unit.Time): void
	sounds: Record<string, instrumentTrigger>
}
