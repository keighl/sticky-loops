export namespace FS {
	export type PluginMessage<T> = {
		command: string
		data: T
	}

	export interface StickyNoteData {
		id: string
		color: string
		rgb: {
			r: number
			g: number
			b: number
		}
		rect: {
			x: number
			y: number
			width: number
			height: number
		}
	}

	export namespace StepData {
		export interface Column {
			index: number
			sounds: Sound[]
		}

		export interface Sound {
			color: string
			rgb: {
				r: number
				g: number
				b: number
			}
		}
	}
}
