import React, { FunctionComponent } from 'react'
import { subdivisionOptions } from '../constants'
import ControlButton from './ControlButton'

type Props = {
	value: string
	onChange: (subdivision: string) => void
}

const SubdivisionControls: FunctionComponent<Props> = ({ value, onChange }) => {
	return (
		<React.Fragment>
			{subdivisionOptions.map(({ id, icon }) => {
				return (
					<ControlButton
						key={id}
						css={{
							flex: 1,
							color: '#777',
							...(value === id
								? {
										borderColor: '#FFFFFF',
										color: '#FFFFFF',
										// boxShadow: `inset 0 0 0 3px #383838, inset 0 0 0 3px #666`,
								  }
								: {}),
						}}
						onClick={() => {
							onChange(id)
						}}
					>
						<div
							css={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								height: '3rem',
							}}
						>
							{icon}
						</div>
					</ControlButton>
				)
			})}
		</React.Fragment>
	)
}

export default SubdivisionControls
