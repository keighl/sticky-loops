import create from 'zustand'
import { FS } from '../types'

export interface FSUI_Store {
	stepData: FS.StepData.Column[]
}

export const useStore = create<FSUI_Store>((set) => ({
	stepData: [],

	setStepData: (stepData: FS.StepData.Column[]) => {
		set({ stepData })
	},
}))
