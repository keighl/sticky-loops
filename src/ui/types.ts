import * as Tone from 'tone'
import { FS } from '../types'

export namespace FSUI {
	export interface Kit {
		trigger(options: Kit_TriggerOptions): void
		sounds: Record<string, Kit_SoundTrigger>
	}

	export type Kit_TriggerOptions = {
		sounds: FS.StepData.Sound[]
		time: Tone.Unit.Time
		subdivision: Tone.Unit.Time
	}

	export type Kit_SoundTrigger = {
		sourceTarget: string
		notes: Tone.Unit.Frequency[]
	}
}
