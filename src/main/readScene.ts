import { FS } from '../types'
import parseSticky from './readStickyNode'

function* parseWalker(
	nodes: readonly SceneNode[]
): Generator<SceneNode, void, boolean> {
	for (let node of nodes) {
		if (node.visible) {
			yield node

			const { children } = node as FrameNode
			if (children) {
				yield* parseWalker(children)
			}
		}
	}
}

let indexChunkTimer: number

const readScene = async (
	nodes: readonly SceneNode[],
	resultsHandler: (results: FS.StickyNoteData[], done: boolean) => Promise<void>
) => {
	const walker = parseWalker(nodes)

	const processChunk = () => {
		let results: FS.StickyNoteData[] = []
		let count = 0
		let done = true
		let res

		while (!(res = walker.next()).done) {
			const node = res.value
			if (node.type === 'STICKY') {
				const parsedSticky = parseSticky(node as StickyNode)

				if (parsedSticky) {
					results = [...results, parsedSticky]
				}
			}

			if (++count === 200) {
				done = false
				indexChunkTimer = setTimeout(processChunk, 100)
				break
			}
		}

		// Emit result chunk
		resultsHandler(results, done)
	}

	processChunk()
}

export default readScene
