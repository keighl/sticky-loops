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

const kitMap: Record<FSUI.KitID, new () => FSUI.Kit> = {
	[KIT_FRAME_808]: Frame808,
	[KIT_SPACE_BEWTWEEN]: SpaceBetween,
	[KIT_CONGA_AS_PNG]: CopyAsPNG,
	[KIT_DOCUMENT_COLORS]: DocumentColors,
}

const useKit = (kitID: FSUI.KitID) => {
	const [kit, setKit] = useState(new kitMap[kitID]())

	useEffect(() => {
		const newKit = new kitMap[kitID]()
		setKit(newKit)
	}, [kitID])

	return kit
}

export default useKit
