import {
	FunctionComponent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import * as Tone from 'tone'

import { useStore } from '../store'
import { FS } from '../../types'
import { FSUI } from '../types'
import DrumKit from '../kits/drumkit'
import TropicalKit from '../kits/tropical'
import Visualizer from './Visualizer'

type Props = {}

const drumKit = new DrumKit()
const tropicalKit = new TropicalKit()

const kitMap: Record<string, FSUI.Kit> = {
	drumKit,
	tropicalKit,
}

const App: FunctionComponent<Props> = ({}) => {
	const toneSequence = useRef<Tone.Sequence | null>(null)

	// Steps
	const { stepData } = useStore((state) => state)

	// Kit
	const [kit, setKit] = useState<string>('drumKit')

	// BPM
	const [bpm, setBpm] = useState(Tone.Transport.bpm.value)
	useEffect(() => {
		Tone.Transport.bpm.rampTo(bpm)
	}, [bpm])

	// Subdivision
	const [subdivision, setSubdivision] = useState('8n')

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

			if (!kitMap[kit]) return

			kitMap[kit].trigger({ sounds: column.sounds, time, subdivision })
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
		Tone.Transport.timeSignature = [4, 4]
		const masterCompressor = new Tone.Compressor({
			threshold: -18,
			ratio: 3,
			attack: 0.5,
			release: 0.1,
		})
		const limiter = new Tone.Limiter(-24)
		const verb = new Tone.Reverb({
			preDelay: 0.01,
			decay: 0.75,
			wet: 0.4,
		})

		Tone.Destination.chain(masterCompressor, verb, limiter)
		Tone.Destination.volume.value = -6

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

		const buildNewSequence = () => {
			// If there is no sequence running, start it up
			Tone.Transport.stop()
			toneSequence.current = new Tone.Sequence(
				_tick,
				stepData,
				subdivision
			).start(0)
			Tone.Transport.start()
			return
		}

		buildNewSequence()
		// Tone.Transport.start()
	}, [stepData, subdivision])

	////

	const play_pause = () => {
		Tone.Transport.toggle()
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
					flex: 0,
					padding: '24px',
				}}
			>
				<div>
					<select
						name="kit"
						id="kit"
						value={kit}
						onChange={(e) => {
							setKit(e.target.value)
						}}
					>
						<option value="tropicalKit">Tropical</option>
						<option value="drumKit">Stark drums</option>
					</select>
				</div>
				<div>
					<select
						name="subdivision"
						id="subdivision"
						value={subdivision}
						onChange={(e) => {
							setSubdivision(e.target.value)
						}}
					>
						<option value="8n">1/8 notes</option>
						<option value="16n">1/16 notes</option>
						<option value="32n">1/32 notes</option>
						<option value="8t">1/8 note triplets</option>
						<option value="4t">1/4 note triplets</option>
					</select>
				</div>
				<br />
				<div>
					BPM: {bpm}
					<br />
					<input
						type="range"
						min={72}
						max={140}
						value={bpm}
						onChange={(e) => {
							setBpm(e.target.valueAsNumber)
						}}
					/>
				</div>
				<br />
				{/* <div>
					<button onClick={play_pause}>{playing ? 'Pause' : 'Play'}</button>
				</div> */}
			</div>

			<Visualizer stepData={stepData} stepIndex={stepIndex} playing={playing} />
		</div>
	)
}

export default App
