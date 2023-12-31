import { FunctionComponent } from 'react'
import { FS } from '../../types'
import { colors } from '../style'
import { stickyColorsByName } from '../../constants'

type Props = {
	stepData: FS.StepData.Column[]
	stepIndex: number
	playing: boolean
}

const Visualizer: FunctionComponent<Props> = ({
	stepData,
	stepIndex,
	playing,
}) => {
	// Build out a visual depicition odf the data
	const indexedColors = stepData.reduce<FS.StepData.Sound[]>(
		(results, column) => {
			const currentSoundsByColor = results.reduce<Record<string, boolean>>(
				(x, sound) => {
					return {
						...x,
						[sound.color]: true,
					}
				},
				{}
			)

			const newSoundsFromColumn: FS.StepData.Sound[] = column.sounds.filter(
				({ color, silent }) => {
					return !currentSoundsByColor[color] && !silent
				}
			)

			return [...results, ...newSoundsFromColumn]
		},
		[]
	)

	return (
		<div
			css={{
				padding: '1rem',
				paddingTop: '0',
				height: '100%',
				display: 'grid',
				gridAutoColumns: '1fr',
				gridAutoFlow: 'column',
				columnGap: stepData.length > 50 ? 0 : 4,
			}}
		>
			{stepData.map((column, idx) => {
				return (
					<Column
						key={idx}
						column={column}
						idx={idx}
						stepIndex={stepIndex}
						allSounds={indexedColors}
						playing={playing}
						packed={stepData.length > 50}
					/>
				)
			})}
		</div>
	)
}

const buttonBG: Record<string, string> = {
	[stickyColorsByName.STICKY_COLOR_GRAY]: `radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(130, 130, 130, 0.15) 100%), #AFBCCF`,
	[stickyColorsByName.STICKY_COLOR_RED]: `radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 0, 0, 0.15) 100%), #FFAFA3`,
	[stickyColorsByName.STICKY_COLOR_BLUE]: `radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(0, 149, 255, 0.15) 100%), #80CAFF`,
	[stickyColorsByName.STICKY_COLOR_ORANGE]: `radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 92, 0, 0.15) 100%), #FFC470`,
	[stickyColorsByName.STICKY_COLOR_PINK]: `radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 0, 205, 0.15) 100%), #FFBDF2`,
	[stickyColorsByName.STICKY_COLOR_LIGHTGRAY]: `black`,
	[stickyColorsByName.STICKY_COLOR_TEAL]: `radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(0, 163, 255, 0.15) 100%), #75D7F0`,
	[stickyColorsByName.STICKY_COLOR_YELLOW]: `radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 192, 0, 0.15) 100%), #FFD966`,
	[stickyColorsByName.STICKY_COLOR_VIOLET]: `radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(103, 36, 180, 0.15) 100%), #D9B8FF`,
	[stickyColorsByName.STICKY_COLOR_GREEN]: `radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(0, 255, 133, 0.15) 100%), #85E0A3`,
}

const Column: FunctionComponent<{
	idx: number
	column: FS.StepData.Column
	stepIndex: number
	allSounds: FS.StepData.Sound[]
	playing: boolean
	packed: boolean
}> = ({ column, stepIndex, allSounds, playing, packed }) => {
	const soundsByColor = column.sounds.reduce<Record<string, boolean>>(
		(x, sound) => {
			return {
				...x,
				[sound.color]: true,
			}
		},
		{}
	)

	const triggered = playing && stepIndex === column.index

	return (
		<div
			css={{
				display: 'grid',
				height: '100%',
				gridAutoRows: '1fr',
				rowGap: '4px',
			}}
		>
			{allSounds.map((sound) => {
				const bg = soundsByColor[sound.color]
					? buttonBG[sound.color]
					: triggered
					? colors.gray50
					: colors.grayBrightness(0.25)
				return (
					<div
						key={sound.color}
						css={{
							display: 'block',
							position: 'relative',
							borderRadius: packed ? 0 : 4,
							backgroundBlendMode: 'multiply, normal',
							boxShadow: triggered
								? soundsByColor[sound.color]
									? `0 0 0.5rem ${sound.color}, inset 0 0 0 1px rgba(255, 255, 255, 0.45)`
									: `none`
								: 'none',

							background: `${bg}`,
						}}
					></div>
				)
			})}
		</div>
	)
}

export default Visualizer
