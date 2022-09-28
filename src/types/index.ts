export namespace FS {
	export type PluginMessage<T> = {
		command: string
		data: T
	}

	export interface StickyNoteData {
		id: string
		color: string
		rect: {
			x: number
			y: number
			width: number
			height: number
		}
	}

	export namespace StepData {
		export interface Column {
			sounds: Sound[]
		}

		export interface Sound {
			color: string
		}
	}
}
