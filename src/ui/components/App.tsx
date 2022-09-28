import {
	FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import * as Tone from 'tone'
import { StepSeq } from '../../types'
import { Kitz } from '../constants'
import DrumKit from '../kits/drumkit'
import TropicalKit from '../kits/tropical'

import { useStore } from '../store'

type Props = {}

const drumKit = new DrumKit()
const tropicalKit = new TropicalKit()

const kitMap: Record<string, Kitz> = {
	drumKit,
	tropicalKit,
}

const App: FunctionComponent<Props> = ({}) => {
	const toneSequence = useRef<Tone.Sequence | null>(null)

	const { sequenceData } = useStore((state) => state)

	const [bpm, setBpm] = useState(Tone.Transport.bpm.value)
	useEffect(() => {
		Tone.Transport.bpm.rampTo(bpm)
	}, [bpm])

	const [kit, setKit] = useState<string>('tropicalKit')
	useEffect(() => {})

	////

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
			kitMap[kit].trigger(uniqueColors, time)
		},
		[kit]
	)

	useEffect(() => {
		if (toneSequence.current) {
			toneSequence.current.callback = _tick
		}
	}, [_tick])

	useEffect(() => {
		Tone.Transport.stop()

		if (toneSequence.current) {
			toneSequence.current.dispose()
		}

		if (sequenceData.beatGroups.length == 0) {
			return
		}

		Tone.Transport.timeSignature = [4 / 4]
		// Tone.Transport.bpm.value = 118
		toneSequence.current = new Tone.Sequence(
			_tick,
			sequenceData.beatGroups.map((group, idx) => {
				return {
					group,
					idx,
				}
			}),
			'8n'
		).start(0)
	}, [sequenceData])

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
				<button onClick={play_pause}>Play/Pause</button>
			</div>
		</div>
	)
}

export default App
