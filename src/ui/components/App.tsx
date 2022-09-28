import {
	FunctionComponent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import * as Tone from 'tone'

import { useStore } from '../store'
import { StepSeq } from '../../types'
import { Kitz } from '../constants'
import DrumKit from '../kits/drumkit'
import TropicalKit from '../kits/tropical'

type Props = {}

const drumKit = new DrumKit()
const tropicalKit = new TropicalKit()

const kitMap: Record<string, Kitz> = {
	drumKit,
	tropicalKit,
}

const App: FunctionComponent<Props> = ({}) => {
	const toneSequence = useRef<Tone.Sequence | null>(null)

	// Steps
	const { sequenceData } = useStore((state) => state)

	// Kit
	const [kit, setKit] = useState<string>('tropicalKit')

	// BPM
	const [bpm, setBpm] = useState(Tone.Transport.bpm.value)
	useEffect(() => {
		Tone.Transport.bpm.rampTo(bpm)
	}, [bpm])

	// Subdivision
	const [subdivision, setSubdivision] = useState('8n')

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
		(time: number, group: { group: StepSeq.BeatGroup; idx: number }) => {
			if (!toneSequence.current) {
				return
			}

			const uniqueColors = Object.keys(
				group.group.triggers.reduce<Record<string, boolean>>(
					(results, trigger) => {
						return { ...results, [trigger.color]: true }
					},
					{}
				)
			)

			if (!kitMap[kit]) return
			kitMap[kit].trigger({ sounds: uniqueColors, time, subdivision })
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

		if (toneSequence.current) {
			toneSequence.current.dispose()
			toneSequence.current = null
		}

		if (sequenceData.beatGroups.length == 0) {
			// If we have no data, shut it down
			Tone.Transport.stop()

			return
		}

		const buildNewSequence = () => {
			// If there is no sequence running, start it up
			Tone.Transport.stop()
			toneSequence.current = new Tone.Sequence(
				_tick,
				sequenceData.beatGroups.map((group, idx) => {
					return {
						group,
						idx,
					}
				}),
				subdivision
			).start(0)
			Tone.Transport.start()
			return
		}

		Tone.Transport.stop()
		buildNewSequence()
		Tone.Transport.start()
	}, [sequenceData, subdivision])

	////

	const play_pause = () => {
		Tone.Transport.toggle()
	}

	return (
		<div>
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
					<option value="4n">1/4 notes</option>
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
			<div>
				<button onClick={play_pause}>{playing ? 'Pause' : 'Play'}</button>
			</div>
		</div>
	)
}

export default App
