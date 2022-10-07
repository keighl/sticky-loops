import {
	ComponentProps,
	ComponentPropsWithRef,
	ElementType,
	forwardRef,
	FunctionComponent,
	ReactNode,
} from 'react'
import { colors } from '../style'

interface Props extends ComponentPropsWithRef<'button'> {}

const ControlButton = forwardRef<HTMLButtonElement, Props>(
	({ children, ...props }, ref) => {
		return (
			<button
				ref={ref}
				css={{
					background: 'none',
					padding: '0rem 0.5rem',
					border: '1px solid #494949',
					borderRadius: '0.25rem',
					cursor: 'pointer',
					color: colors.gray10,
					boxSizing: 'border-box',

					'&:focus': {
						outline: 'none',
						border: `1px solid ${colors.gray40}`,
					},
				}}
				{...props}
			>
				{children}
			</button>
		)
	}
)

export default ControlButton

interface ControlBoxProps extends ComponentPropsWithRef<any> {
	tag: keyof JSX.IntrinsicElements
}

export const ControlBox: FunctionComponent<ControlBoxProps> = (
	{ tag, ref, children, ...props } = { tag: 'div' }
) => {
	const Tag = tag
	return (
		<Tag
			css={{
				background: 'none',
				padding: '0rem 0.5rem',
				border: '1px solid #494949',
				borderRadius: '0.25rem',
				cursor: 'pointer',
				color: colors.gray10,
				boxSizing: 'border-box',

				'&:focus-within': {
					outline: 'none',
					border: `1px solid ${colors.gray40}`,
				},
			}}
			{...props}
		>
			{children}
		</Tag>
	)
}
