import {
	FunctionComponent,
	ReactHTMLElement,
	useEffect,
	useLayoutEffect,
	useRef,
} from 'react'
import { kitOptions } from '../constants'
import { colors, typeRamp } from '../style'
import { Radio, RadioGroup, useRadioState } from 'ariakit/radio'
import { VisuallyHidden } from 'ariakit'
import { motion } from 'framer-motion'

type Props = {
	value: string
	onChange: (kit: string) => void
}

const KitSelection: FunctionComponent<Props> = ({ value, onChange }) => {
	const radio = useRadioState({
		value,
		setValue: (value) => {
			onChange(value as string)
		},
	})

	const activeRef = useRef<HTMLInputElement | null>(null)
	useLayoutEffect(() => {
		if (activeRef.current) {
			activeRef.current.focus()
		}
	}, [])

	return (
		<motion.div
			initial={{ y: '2rem' }}
			animate={{ y: 0 }}
			exit={{ y: '-4rem' }}
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
		</motion.div>
	)
}

export default KitSelection
