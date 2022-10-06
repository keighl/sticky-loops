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
				return (
					<div
						key={sound.color}
						css={{
							display: 'block',
							position: 'relative',
							borderRadius: '4px',
							background: soundsByColor[sound.color]
								? `${sound.color}`
								: '#323232',
						}}
					>
						<div
							css={{
								display: !soundsByColor[sound.color] ? 'block' : 'none',
								opacity: triggered ? 1 : 0,
								position: 'absolute',
								left: 0,
								right: 0,
								top: 0,
								bottom: 0,
								width: '100%',
								background: 'rgba(255,255,255,0.1)',
								transition: 'opacity 50ms linear',
								borderRadius: '4px',
							}}
						></div>
					</div>
				)
			})}
		</div>
	)
}

export default Visualizer
