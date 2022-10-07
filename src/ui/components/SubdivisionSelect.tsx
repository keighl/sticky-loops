import { FunctionComponent, ComponentProps, useRef, useEffect } from 'react'
import keycode from 'keycode'
import { Radio, RadioGroup, useRadioState } from 'ariakit/radio'
import { VisuallyHidden } from 'ariakit'

import { subdivisionOptions } from '../constants'
import { colors } from '../style'
import ControlButton, { ControlBox } from './ControlButton'

interface Props extends ComponentProps<'div'> {
	value: string
	onChangeSubdivision: (subdivision: string | null, close: boolean) => void
}

const SubdivisionSelect: FunctionComponent<Props> = ({
	value,
	onChangeSubdivision,
}) => {
	const radio = useRadioState({
		value,
		setValue: (value) => {
			onChangeSubdivision(value as string, false)
		},
	})

	// Set initial focus
	const activeRef = useRef<HTMLInputElement | null>(null)
	useEffect(() => {
		if (activeRef.current) {
			activeRef.current.focus()
		}
	}, [])

	// keyboard handling
	useEffect(() => {
		const keyDownHandler = (event: Event) => {
			switch (keycode(event)) {
				case 'enter':
					onChangeSubdivision(null, true)
					break
				default:
					break
			}
		}

		document.addEventListener('keydown', keyDownHandler)

		return () => {
			document.removeEventListener('keydown', keyDownHandler)
		}
	}, [])

	return (
		<RadioGroup
			state={radio}
			css={{
				height: '100%',
				display: 'flex',
				'& > * + *': {
					marginLeft: '0.5rem',
				},
			}}
		>
			{subdivisionOptions.map(({ id, icon }) => {
				const isChecked = id === radio.value
				return (
					<ControlBox
						tag="label"
						key={id}
						css={{
							flex: 1,
							...(value === id
								? {
										color: colors.white,
								  }
								: {
										color: colors.gray60,
								  }),
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

						<VisuallyHidden>
							<Radio
								value={id}
								ref={(el) => {
									if (isChecked) {
										activeRef.current = el
									}
								}}
							/>
						</VisuallyHidden>
					</ControlBox>
				)
			})}

			<ControlButton
				css={{
					flex: 0,
					height: '100%',
					background: colors.grayBrightness(0.15),
					border: `1px solid ${colors.grayBrightness(0.15)}`,
					color: colors.gray50,

					'&:focus': {
						borderColor: colors.gray60,
					},
				}}
				onClick={() => {
					onChangeSubdivision(radio.value as string, true)
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
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path
							d="M3.33332 4.27333L4.27332 3.33333L7.99999 7.06L11.7267 3.33333L12.6667 4.27333L8.93999 7.99999L12.6667 11.7267L11.7267 12.6667L7.99999 8.93999L4.27332 12.6667L3.33332 11.7267L7.05999 7.99999L3.33332 4.27333Z"
							fill="currentColor"
						/>
					</svg>
				</div>
			</ControlButton>
		</RadioGroup>
	)
}

export default SubdivisionSelect
