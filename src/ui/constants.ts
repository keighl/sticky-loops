import * as Tone from 'tone'

export type instrumentTrigger = {
	sourceTarget: string
	notes: Tone.Unit.Frequency[]
}

export type KitTriggerOptions = {
	sounds: string[]
	time: Tone.Unit.Time
	subdivision: Tone.Unit.Time
}

export interface Kitz {
	trigger(options: KitTriggerOptions): void
	sounds: Record<string, instrumentTrigger>
}
