import { FunctionComponent, ComponentProps } from 'react'
import { subdivisionOptions } from '../constants'
import ControlButton from './ControlButton'

interface Props extends ComponentProps<'div'> {
	value: string
	onChangeSubdivision: (subdivision: string) => void
}

const SubdivisionSelect: FunctionComponent<Props> = ({
	value,
	onChangeSubdivision,
}) => {
	return (
		<div
			css={{
				height: '100%',
				display: 'flex',
				'& > * + *': {
					marginLeft: '0.5rem',
				},
			}}
		>
			{subdivisionOptions.map(({ id, icon }) => {
				return (
					<ControlButton
						key={id}
						css={{
							height: '100%',
							flex: 1,
							color: '#777',
							...(value === id
								? {
										borderColor: '#FFFFFF',
										color: '#FFFFFF',
								  }
								: {}),
						}}
						onClick={() => {
							onChangeSubdivision(id)
						}}
					>
						<div
							css={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								height: '100%',
							}}
						>
							{icon}
						</div>
					</ControlButton>
				)
			})}
		</div>
	)
}

export default SubdivisionSelect
