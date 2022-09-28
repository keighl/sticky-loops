import rgbHex from 'rgb-hex'
import { FS } from '../types'

const parseSticky = (node: StickyNode): FS.StickyNoteData | null => {
	let color: string | null = null
	let [r, g, b] = [255, 255, 255]
	if (node.fills && node.fills !== figma.mixed) {
		for (const fill of node.fills) {
			if (!fill) {
				continue
			}

			if (fill.type === 'SOLID') {
				const rgb = (fill as SolidPaint).color
				r = Math.round(rgb.r * 255.0)
				g = Math.round(rgb.g * 255.0)
				b = Math.round(rgb.b * 255.0)

				color = `#${rgbHex(r, g, b).toUpperCase()}`
				break
			}
		}
	}

	const stickyNoteData: FS.StickyNoteData = {
		id: node.id,
		rect: {
			x: node.x,
			y: node.y,
			width: node.width,
			height: node.height,
		},
		color: color ? color : '___',
		rgb: { r, g, b },
	}
	return stickyNoteData
}

export default parseSticky
