import { FunctionComponent } from 'react'
import { FS } from '../../types'
import { colors } from '../style'

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
				columnGap: '4px',
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
					/>
				)
			})}
		</div>
	)
}

const Column: FunctionComponent<{
	idx: number
	column: FS.StepData.Column
	stepIndex: number
	allSounds: FS.StepData.Sound[]
	playing: boolean
}> = ({ column, stepIndex, allSounds, playing }) => {
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
					? sound.color
					: triggered
					? colors.gray50
					: colors.grayBrightness(0.25)
				return (
					<div
						key={sound.color}
						css={{
							display: 'block',
							position: 'relative',
							borderRadius: '4px',
							// backgroundColor: soundsByColor[sound.color]
							// 	? sound.color
							// 	: triggered
							// 	? colors.gray50
							// 	: colors.grayBrightness(0.25),

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
