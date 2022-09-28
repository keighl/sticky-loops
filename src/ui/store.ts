import create from 'zustand'
import { StepSeq } from '../types'

export interface Store_SequenceData {
	beatGroups: StepSeq.BeatGroup[]
}

export interface FigmaSynthStore {
	sequenceData: Store_SequenceData
}

export const useStore = create<FigmaSynthStore>((set) => ({
	sequenceData: {
		beatGroups: [],
	},

	setSequenceData: (sequenceData: Store_SequenceData) => {
		set({ sequenceData })
	},
}))
