import { FunctionComponent } from 'react'
import { FS } from '../../types'

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
				({ color }) => {
					return !currentSoundsByColor[color]
				}
			)

			return [...results, ...newSoundsFromColumn]
		},
		[]
	)

	return (
		<div
			css={{
				padding: '8px',
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
				return (
					<div
						key={sound.color}
						css={{
							display: 'block',
							position: 'relative',
							background: soundsByColor[sound.color]
								? `${sound.color}`
								: // : `rgba(${sound.rgb.r}, ${sound.rgb.g}, ${sound.rgb.b}, 0.2)`,
								  '#fafafa',

							boxShadow:
								triggered && soundsByColor[sound.color]
									? `inset 0 0 0 2px rgba(0, 0, 0, 0.2)`
									: 'none',
						}}
					>
						<div
							css={{
								display:
									triggered && !soundsByColor[sound.color] ? 'block' : 'none',
								position: 'absolute',
								left: 0,
								right: 0,
								top: 0,
								bottom: 0,
								width: '100%',
								background: 'rgba(0,0,0,0.01)',
							}}
						></div>
					</div>
				)
			})}
		</div>
	)
}

export default Visualizer
