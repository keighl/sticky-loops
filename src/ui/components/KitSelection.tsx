import { FunctionComponent, useEffect, useRef } from 'react'
import keycode from 'keycode'
import { Radio, RadioGroup, useRadioState } from 'ariakit/radio'
import { VisuallyHidden } from 'ariakit'
import { motion } from 'framer-motion'

import { kitOptions } from '../constants'
import { colors, typeRamp } from '../style'

type Props = {
	value: string
	onChange: (kit: string, close: boolean) => void
}

const KitSelection: FunctionComponent<Props> = ({ value, onChange }) => {
	const radio = useRadioState({
		value,
		setValue: (value) => {
			onChange(value as string, false)
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
				background: '#2C2C2C',
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
				{kitOptions.map((option) => {
					const isChecked = option.id === radio.value
					return (
						<label
							key={option.id}
							role="option"
							css={{
								position: 'relative',
								background: isChecked ? '#212121' : '#2C2C2C',
								...typeRamp.med_14,
								padding: '0.5rem',
								display: 'flex',
								'&:focus-within': {
									background: '#212121',
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
									color: value === option.id ? colors.white : '#DCDCDC',
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
