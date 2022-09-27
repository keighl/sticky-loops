import { FunctionComponent, useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { StepSeq } from '../../types'
import Kit from '../kits'

import { useStore } from '../store'

type Props = {}

const kit = new Kit()

const App: FunctionComponent<Props> = ({}) => {
	const toneSequence = useRef<Tone.Sequence | null>(null)

	const { sequenceData } = useStore((state) => state)

	const _tick = (
		time: number,
		group: { group: StepSeq.BeatGroup; idx: number }
	) => {
		console.log('tick')

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

		kit.trigger(uniqueColors, time)
	}

	useEffect(() => {
		Tone.Transport.stop()

		if (toneSequence.current) {
			toneSequence.current.dispose()
		}

		if (sequenceData.beatGroups.length == 0) {
			return
		}

		Tone.Transport.timeSignature = [4 / 4]
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

	const parse_then_play = () => {
		Tone.Transport.toggle()
	}

	return (
		<div>
			<button onClick={parse_then_play}>Play</button>
		</div>
	)
}

export default App
