import { FSUI } from '../types'

class Kit {
	public id = 'abstract'
	public soundsLoaded = false
	protected onLoad: FSUI.KitCallbackLoad
	protected onError: FSUI.KitCallbackError

	constructor(onLoad: FSUI.KitCallbackLoad, onError: FSUI.KitCallbackError) {
		this.onLoad = onLoad
		this.onError = onError
	}

	public trigger(options: FSUI.Kit_TriggerOptions) {}
}

export default Kit
