export namespace StepSeq {
	export type FigmaPluginMessage = {
		command: string
		data: any
	}

	export interface SoundTrigger {
		id: string
		color: string
		rect: {
			x: number
			y: number
			width: number
			height: number
		}
	}

	export interface BeatGroup {
		minX: number
		maxX: number
		meanX: number
		triggers: SoundTrigger[]
	}
}
