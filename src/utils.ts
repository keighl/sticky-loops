import NearestColor from 'nearest-color'
import { stickyColorsByName } from './constants'

const check = NearestColor.from(
	Object.keys(stickyColorsByName).reduce<Record<string, string>>(
		(result, c) => {
			return {
				...result,
				[stickyColorsByName[c]]: stickyColorsByName[c],
			}
		},
		{}
	)
)

export const closestStickyColor = (color: string): string => {
	return check(color).value
}
