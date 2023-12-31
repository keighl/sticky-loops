import {
	FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import _debounce from 'lodash/debounce'
import * as Tone from 'tone'
import { FocusTrapRegion } from 'ariakit/focus-trap'
import { VisuallyHidden } from 'ariakit'
import { motion, AnimatePresence } from 'framer-motion'
import keycode from 'keycode'

import { useStore } from '../store'
import { FS } from '../../types'
import Visualizer from './Visualizer'
import ControlButton from './ControlButton'
import SubdivisionSelect from './SubdivisionSelect'
import { kits, kitsByID, subdivisionOptionsById } from '../constants'
import KitSelect from './KitSelect'
import { colors, typeRamp } from '../style'
import TempoSelect from './TempoSelect'
import SelectionImage from './NoDataImage'
import { FSUI } from '../types'
import useKit from '../useKit'

type Props = {}

const App: FunctionComponent<Props> = ({}) => {
	useEffect(() => {
		// set initial focus in the plugin upon launch
		window.focus()
	}, [])
	const toneSequence = useRef<Tone.Sequence | null>(null)

	// UI control state
	const [controlState, setControlState] = useState<
		'kit' | 'subdivision' | null
	>(null)

	const clearControlState = () => {
		setControlState(null)
	}

	const setKitFocus = () => {
		setControlState('kit')
	}

	const setSubdivisionFocus = () => {
		setControlState('subdivision')
	}

	// Steps
	const { stepData } = useStore((state) => state)

	// Error handling
	const notifyError = (error: Error) => {
		const message: FS.PluginMessage<{ error: Error; message: string }> = {
			command: 'notifyError',
			data: {
				error,
				message: 'There was an issue loading Sticky Loops sounds...',
			},
		}
		parent.postMessage({ pluginMessage: message }, '*')
	}

	const debouncedNotifyError = useMemo(() => _debounce(notifyError, 300), [])

	// Kit
	const [kitID, setKitID] = useState<FSUI.KitID>(kits[0].id)

	const handleKitError: FSUI.KitCallbackError = (error: Error) => {
		debouncedNotifyError(error)
	}

	const kit = useKit(kitID, handleKitError)

	// BPM
	const [bpm, setBpm] = useState(Tone.Transport.bpm.value)
	useEffect(() => {
		Tone.Transport.bpm.rampTo(bpm)
	}, [bpm])

	// Subdivision
	const [subdivision, setSubdivision] = useState('8t')

	// index
	const [stepIndex, setStepIndex] = useState(-1)

	// Status
	const [playing, setPlaying] = useState(false)

	useEffect(() => {
		Tone.Transport.on('pause', () => {
			setPlaying(false)
		})
		Tone.Transport.on('start', () => {
			setPlaying(true)
		})
		Tone.Transport.on('stop', () => {
			setPlaying(false)
		})

		return () => {
			Tone.Transport.off('pause')
			Tone.Transport.off('start')
			Tone.Transport.off('stop')
		}
	}, [])

	// Tick
	const _tick = useCallback(
		(time: number, column: FS.StepData.Column) => {
			if (!toneSequence.current) {
				return
			}

			kit.trigger({ sounds: column.sounds, time, subdivision })
			setStepIndex(column.index)
		},
		[kit, subdivision]
	)

	useEffect(() => {
		// Update the tick call back so we grab the right kit sounds
		if (toneSequence.current) {
			toneSequence.current.callback = _tick
		}
	}, [_tick])

	useEffect(() => {
		// If the loop is already going, restart the new sequence
		const shouldRestart = Tone.Transport.state === 'started'

		Tone.Transport.timeSignature = [4, 4]

		if (toneSequence.current) {
			toneSequence.current.dispose()
			toneSequence.current = null
			Tone.Transport.stop()
		}

		if (stepData.length == 0) {
			// If we have no data, shut it down
			Tone.Transport.stop()

			return
		}

		toneSequence.current = new Tone.Sequence(
			_tick,
			stepData,
			subdivision
		).start(0)

		if (shouldRestart) {
			Tone.Transport.start()
		}
	}, [stepData, subdivision])

	////

	const play_pause = () => {
		if (Tone.Transport.state !== 'started') {
			Tone.start()
			Tone.Transport.start()
		} else {
			Tone.Transport.stop()
		}
	}

	////

	// keyboard handling
	useEffect(() => {
		const keyDownHandler = (event: Event) => {
			switch (keycode(event)) {
				case 'esc':
					clearControlState()
					break
				case 'space':
					Tone.Transport.toggle()
					event.preventDefault()
					// dont let the space button bubble up to
					// buttons as a click. We want space bar to
					// be exclusively for play/pause
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

	if (stepData.length === 0) {
		return (
			<motion.div
				animate={{
					opacity: 1,
				}}
				transition={{
					delay: 0.2,
				}}
				initial={{
					opacity: 0,
				}}
				css={{
					display: 'flex',
					flexDirection: 'column',
					height: '100vh',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<SelectionImage />
				<div
					css={{
						...typeRamp.reg_16,
						textAlign: 'center',
						width: '260px',
						paddingTop: '2rem',
					}}
				>
					Select sticky notes or shapes to begin.
				</div>
			</motion.div>
		)
	}

	return (
		<div
			css={{
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
			}}
		>
			<div
				css={{
					width: '100%',
					flex: 0,
					padding: '1rem',
				}}
			>
				<div
					css={{
						width: '100%',
						height: '3rem',
						overflow: 'visible',
					}}
				>
					<AnimatePresence initial={false}>
						{controlState !== 'subdivision' && (
							<motion.div
								key="maincontrols"
								initial={{ opacity: 0, y: '1rem' }}
								animate={{
									y: 0,
									opacity: 1,
									transition: {
										duration: 0.25,
										delay: 0.35,
									},
								}}
								exit={{
									y: '-1rem',
									opacity: 0,
									transition: {
										duration: 0.25,
									},
								}}
								css={{
									display: 'flex',
									width: '100%',
									height: '100%',
									'& > * + *': {
										marginLeft: '0.5rem',
									},
								}}
							>
								<ControlButton onClick={play_pause}>
									<div
										css={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											height: '3rem',
										}}
									>
										{playing && (
											<svg width="9" height="10" viewBox="0 0 9 10" fill="none">
												<path
													d="M3.17647 0L1.90735e-06 0L1.90735e-06 10H3.17647V0Z"
													fill="#D9D9D9"
												/>
												<path d="M9 0L5.82353 0V10H9V0Z" fill="currentColor" />
											</svg>
										)}
										{!playing && (
											<svg width="9" height="10" viewBox="0 0 9 10" fill="none">
												<path d="M9 5L0 0V10L9 5Z" fill="currentColor" />
											</svg>
										)}
									</div>
								</ControlButton>

								<div
									css={{
										width: '28%',
										// flex: '0 0',
										height: '3rem',
									}}
								>
									<TempoSelect value={bpm} onBPMChange={setBpm} />
								</div>

								<ControlButton onClick={setSubdivisionFocus}>
									<div
										css={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											height: '3rem',
										}}
									>
										{subdivisionOptionsById[subdivision].icon}
									</div>
								</ControlButton>
								<ControlButton
									onClick={setKitFocus}
									css={{ flex: 1, textAlign: 'left' }}
								>
									<div
										css={{
											width: '100%',
											display: 'flex',
											alignItems: 'center',
											height: '3rem',
										}}
									>
										<div
											css={{
												display: 'block',
											}}
										>
											<div
												css={{
													display: 'block',
													...typeRamp.reg_10,
													color: colors.gray60,
												}}
											>
												sound
											</div>
											<div
												css={{
													...typeRamp.med_14,
													whiteSpace: 'nowrap',
												}}
											>
												{kitsByID[kitID].name}
											</div>
										</div>
									</div>
								</ControlButton>
							</motion.div>
						)}
						{controlState === 'subdivision' && (
							<motion.div
								key="subdivionscontrols"
								initial={{ y: '1rem', opacity: 0 }}
								animate={{
									y: 0,
									opacity: 1,
									transition: {
										delay: 0.35,
										duration: 0.25,
									},
								}}
								exit={{
									y: '-1rem',
									opacity: 0,
									transition: {
										delay: 0.1,
										duration: 0.25,
									},
								}}
								css={{
									width: '100%',
									height: '100%',
								}}
							>
								<SubdivisionSelect
									value={subdivision}
									onChangeSubdivision={(s, close) => {
										if (s) {
											setSubdivision(s)
										}

										if (close) {
											clearControlState()
										}
									}}
									css={{
										height: '100%',
										width: '100%',
									}}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			<Visualizer stepData={stepData} stepIndex={stepIndex} playing={playing} />

			<AnimatePresence>
				{controlState === 'kit' && (
					<motion.div
						key="overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{
							opacity: 0,
							transition: {
								delay: 0.1,
							},
						}}
						transition={{
							duration: 0.35,
						}}
						css={{
							position: 'absolute',
							zIndex: 100000,
							top: 0,
							left: 0,
							width: '100vw',
							height: '100vh',
							background: 'rgba(56, 56, 56, 0.88)',
							backdropFilter: 'blur(4px)',
						}}
					>
						<div
							css={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100vw',
								height: '100vh',
								display: 'flex',
								padding: '1rem',
								alignItems: 'center',
							}}
						>
							<button
								tabIndex={-1}
								css={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									cursor: 'pointer',
									background: 'none',
									border: 0,
									':focus': {
										appearance: 'none',
										outline: 'none',
									},
								}}
								onClick={clearControlState}
							>
								<VisuallyHidden>Close</VisuallyHidden>
							</button>
							<FocusTrapRegion
								css={{
									width: '100%',
								}}
								enabled={true}
							>
								<motion.div
									key="kitselect"
									initial={{ y: '2rem', opacity: 0 }}
									animate={{
										y: 0,
										opacity: 1,
										transition: {
											duration: '0.4',
										},
									}}
									exit={{
										opacity: 0,
										transition: {
											duration: 0.2,
										},
									}}
									// transition={{
									// 	duration: 0.3,
									// }}
								>
									<KitSelect
										value={kitID}
										onChange={(kitID, close) => {
											setKitID(kitID)
											if (close) {
												setControlState(null)
											}
										}}
									/>
								</motion.div>
							</FocusTrapRegion>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default App
