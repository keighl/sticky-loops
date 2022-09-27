import rgbHex from 'rgb-hex'
import { StepSeq } from '../types'

const parseSticky = (node: StickyNode): StepSeq.SoundTrigger | null => {
	console.log(node.fills)

	let color: string | null = null

	if (node.fills && node.fills !== figma.mixed) {
		for (const fill of node.fills) {
			if (!fill) {
				continue
			}
			console.log(fill)

			if (fill.type === 'SOLID') {
				const { r, g, b } = (fill as SolidPaint).color
				console.log(r, g, b)

				color = `#${rgbHex(
					Math.round(r * 255.0),
					Math.round(g * 255.0),
					Math.round(b * 255.0)
				).toUpperCase()}`
				break
			}
		}
	}

	const instruction: StepSeq.SoundTrigger = {
		id: node.id,
		rect: {
			x: node.x,
			y: node.y,
			width: node.width,
			height: node.height,
		},
		color: color ? color : '___',
	}
	return instruction
}

export default parseSticky
