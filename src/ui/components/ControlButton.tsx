import { ButtonHTMLAttributes, FunctionComponent } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ControlButton: FunctionComponent<Props> = ({ children, ...props }) => {
	return (
		<button
			css={{
				background: 'none',
				padding: '0rem 0.5rem',
				border: '1px solid #494949',
				borderRadius: '0.25rem',
				cursor: 'pointer',
				color: '#DCDCDC',
				height: '3rem',

				'&:focus': {
					border: '1px solid #666',
				},
			}}
			{...props}
		>
			{children}
		</button>
	)
}

export default ControlButton
