import { ColorTranslator } from 'colortranslator'
import { stickyColorHues, STICKY_COLOR_LIGHTGRAY } from './constants'

export const closestStickyColor = (color: string): string => {
	const { h: nodeHue } = new ColorTranslator(color).HSLObject

	type HueAccumulator = {
		closestColorID: string
		distance: number
	}
	const { closestColorID } = Object.keys(
		stickyColorHues
	).reduce<HueAccumulator>(
		(result, key) => {
			const canonicalHue = stickyColorHues[key]

			const distance = Math.abs(canonicalHue - nodeHue)
			if (distance < result.distance) {
				return {
					closestColorID: key,
					distance,
				}
			}
			return result
		},
		{
			closestColorID: STICKY_COLOR_LIGHTGRAY,
			distance: Infinity,
		} as HueAccumulator
	)

	return closestColorID
}
