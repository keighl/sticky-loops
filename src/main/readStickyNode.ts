import rgbHex from 'rgb-hex'
import { stickyColorsByHex, stickyColorsByName } from '../constants'
import { FS } from '../types'
import { closestStickyColor } from '../utils'

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

	if (!color) {
		console.log(
			`StickyLoops: No fill on ${node.type} - Converting to lightgray`
		)
		color = stickyColorsByName.STICKY_COLOR_LIGHTGRAY
	}

	if (!stickyColorsByHex[color!]) {
		console.log(`StickyLoops: Non-standard sticky color`, color)

		color = closestStickyColor(color!)
		console.log('   ==> Remap to', color)
	}

	const stickyNoteData: FS.StickyNoteData = {
		id: node.id,
		rect: {
			x: node.x,
			y: node.y,
			width: node.width,
			height: node.height,
		},
		color: color!,
		rgb: { r, g, b },
	}
	return stickyNoteData
}

export default parseSticky
