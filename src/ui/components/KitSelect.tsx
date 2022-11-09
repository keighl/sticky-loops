import { FunctionComponent, useEffect, useRef } from 'react'
import keycode from 'keycode'
import { Radio, RadioGroup, useRadioState } from 'ariakit/radio'
import { VisuallyHidden } from 'ariakit'

import { kits } from '../constants'
import { colors, typeRamp } from '../style'

type Props = {
	value: string
	onChange: (kit: string, close: boolean) => void
}

const KitSelection: FunctionComponent<Props> = ({ value, onChange }) => {
	const radio = useRadioState({
		value,
		setValue: (value) => {
			onChange(value as string, true)
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
					onChange(radio.value as string, true)
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
		<div
			css={{
				width: '100%',
				borderRadius: '0.25rem',
				overflow: 'hidden',
			}}
		>
			<RadioGroup
				state={radio}
				css={{
					'& > * + *': {
						borderTop: `1px solid ${colors.gray80}`,
					},
				}}
			>
				{kits.map((option) => {
					const isChecked = option.id === radio.value
					return (
						<label
							key={option.id}
							role="option"
							css={{
								position: 'relative',
								background: isChecked
									? colors.grayBrightness(0.13)
									: colors.gray15,
								...typeRamp.med_14,
								padding: '0.5rem',
								display: 'flex',
								'&:focus-within': {
									background: colors.grayBrightness(0.13),
								},
								transition: 'background 75ms linear',
							}}
						>
							<VisuallyHidden>
								<Radio
									value={option.id}
									ref={(el) => {
										if (isChecked) {
											activeRef.current = el
										}
									}}
								/>
							</VisuallyHidden>
							<div
								css={{
									flex: 1,
									color: value === option.id ? colors.white : colors.gray50,
								}}
							>
								{option.name}
							</div>
						</label>
					)
				})}
			</RadioGroup>
		</div>
	)
}

export default KitSelection
