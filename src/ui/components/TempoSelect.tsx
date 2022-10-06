import { ChangeEvent, ComponentProps, FunctionComponent } from 'react'
import { bpmMax, bpmMin } from '../constants'
import { typeRamp } from '../style'

interface Props extends ComponentProps<'input'> {
	value: number
	onBPMChange: (tempo: number) => void
}

const TempoSelect: FunctionComponent<Props> = ({ value, onBPMChange }) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onBPMChange(e.target.valueAsNumber)
	}

	return (
		<div
			css={{
				padding: '0rem 0.5rem',
				border: '1px solid #494949',
				borderRadius: '0.25rem',
				display: 'flex',
				alignItems: 'center',
				height: '3rem',
			}}
		>
			<div
				css={{
					transform: 'translateY(-2px)',
				}}
			>
				<div
					css={{
						...typeRamp.bold_12,
						marginBottom: '0.5rem',
					}}
				>
					{value}
				</div>

				<div>
					<input
						css={{
							WebkitAppearance: 'none',
							background: 'transparent',
							cursor: 'pointer',
							width: '100%',

							'&::-webkit-slider-runnable-track': {
								background: '#505050',
								height: '0.25rem',
								borderRadius: '1rem',

								backgroundImage: 'linear-gradient(#CACACA, #CACACA)',
								backgroundSize: `${((value - bpmMax) / bpmMin) * 100}% 100%`,
								backgroundRepeat: 'no-repeat',
							},

							'&::-webkit-slider-thumb': {
								WebkitAppearance: 'none',
								appearance: 'none',
								width: '0.75rem',
								height: '0.75rem',
								transform: 'translateY(-4px)',
								background: '#FFFFFF',
								borderRadius: '1rem',
							},

							'&:focus': {
								appearance: 'none',
								outline: 'none',
								'&::-webkit-slider-thumb': {
									boxShadow: '0 0 0 2px #383838, 0 0 0 4px #FFFFFF',
								},
							},
						}}
						type="range"
						min={72}
						max={140}
						value={value}
						onChange={handleChange}
					/>
				</div>
			</div>
		</div>
	)
}

export default TempoSelect
