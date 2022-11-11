import { useEffect, useState } from 'react'

import Frame808 from './kits/frame808'
import SpaceBetween from './kits/spaceBetween'
import CopyAsPNG from './kits/copyAsPNG'
import DocumentColors from './kits/documentColors'
import {
	KIT_CONGA_AS_PNG,
	KIT_DOCUMENT_COLORS,
	KIT_FRAME_808,
	KIT_SPACE_BEWTWEEN,
} from './constants'
import { FSUI } from './types'
import Kit from './kits/kit'

type X<T extends Kit> = T

const kitMap: Record<
	FSUI.KitID,
	new (onLoad: FSUI.KitCallbackLoad, onError: FSUI.KitCallbackError) => Kit
> = {
	[KIT_FRAME_808]: Frame808,
	[KIT_SPACE_BEWTWEEN]: SpaceBetween,
	[KIT_CONGA_AS_PNG]: CopyAsPNG,
	[KIT_DOCUMENT_COLORS]: DocumentColors,
}

const useKit = (kitID: FSUI.KitID, onError: FSUI.KitCallbackError) => {
	const [kitCache, setKitCache] = useState<Record<FSUI.KitID, Kit>>({})

	const handleSoundLoaded: FSUI.KitCallbackLoad = () => {}

	const [kit, setKit] = useState(new kitMap[kitID](handleSoundLoaded, onError))

	useEffect(() => {
		const cachedKit = kitCache[kitID]
		if (cachedKit) {
			console.log('Found cached kit:', kitID)

			setKit(cachedKit)
			return
		}

		const newKit = new kitMap[kitID](handleSoundLoaded, onError)
		setKit(newKit)
	}, [kitID])

	useEffect(() => {
		if (kit.soundsLoaded) {
			console.log(kit.id, 'soundsLoaded, caching instance')
			setKitCache((prevCache) => {
				return {
					...prevCache,
					[kit.id]: kit,
				}
			})
		}
	}, [kit.soundsLoaded])

	return kit
}

export default useKit
