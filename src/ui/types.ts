import * as Tone from 'tone'
import { FS } from '../types'

export namespace FSUI {
	export type KitID = string

	export interface Kit {
		id: string
		trigger(options: Kit_TriggerOptions): void
		sounds: Record<string, Kit_SoundTrigger>
		soundsLoaded: boolean
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
