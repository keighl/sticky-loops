import readScene from './readScene'
import { StepSeq } from '../types'

figma.showUI(__html__, {})

const parseThenPlay = (selection: readonly SceneNode[]) => {
	let instructions: StepSeq.StickyTrigger[] = []

	// Hoisted index resolver
	let resolveParsing = () => {}

	new Promise<void>((resolve) => {
		// Hoist the promise resolution outwards so
		// we can trigger resolution from "handleChunk"
		resolveParsing = resolve
	}).then(() => {
		// finish
	})

	const handSceneChunk = async (
		results: StepSeq.StickyTrigger[],
		done: boolean
	) => {
		// Pump the results into our map
		instructions = [...instructions, ...results]

		// If this is the last chunk...
		if (done) {
			// Figure out the arrangement of the stickies!
			// we're looking to identify columns that will
			// fire together on the sequence

			// Organize the stickies into columns
			let columns: StepSeq.BeatGroup[] = []

			// Start with the topmost stickies
			const sortedByY = instructions.sort((a, b) => a.rect.y - b.rect.y)

			sortedByY.forEach((trigger) => {
				const stickyMinX = trigger.rect.x
				const stickyMaxX = trigger.rect.x + trigger.rect.width

				// Find the column, if any, with the highest overlap
				const columnMatches = columns
					.map((col, index) => {
						return {
							index,
							overlap:
								Math.min(stickyMaxX, col.maxX) - Math.max(stickyMinX, col.minX),
						}
					})
					.filter((x) => x.overlap > 0)
					.sort((a, b) => a.overlap - b.overlap)

				if (columnMatches.length > 0) {
					// If we have a column match, toss this sticky in
					// it and update the column's mix/max values
					const matchedColumn = columns[columnMatches[0].index]
					matchedColumn.minX = Math.min(matchedColumn.minX, stickyMinX)
					matchedColumn.maxX = Math.max(matchedColumn.minX, stickyMaxX)
					matchedColumn.meanX = (matchedColumn.minX + matchedColumn.minX) / 2.0
					matchedColumn.triggers = [...matchedColumn.triggers, trigger]
					columns[columnMatches[0].index] = matchedColumn
				} else {
					// Doesn't fit any existing columns, so add a new one
					const newColumn: StepSeq.BeatGroup = {
						minX: stickyMinX,
						maxX: stickyMaxX,
						meanX: (stickyMinX + stickyMaxX) / 2.0,
						triggers: [trigger],
					}

					columns = [...columns, newColumn]
				}
			})

			// Sort the columns left to right
			columns = columns.sort((a, b) => a.minX - b.minX)

			// 2) trigger the index resolver
			const message: StepSeq.FigmaPluginMessage = {
				command: 'play_instructions',
				data: {
					beatGroups: columns,
				},
			}
			figma.ui.postMessage(message)
			resolveParsing()
		}
	}

	readScene(selection, handSceneChunk).then(() =>
		console.log('SS_', 'parse START')
	)
}

figma.on('run', async () => {
	parseThenPlay(figma.currentPage.selection)
})

figma.on('selectionchange', async () => {
	if (figma.currentPage.selection.length > 0) {
		parseThenPlay(figma.currentPage.selection)
	}

	// Just keep whatever data is currrently loaded up if there is no selection...
})

figma.ui.onmessage = (message: StepSeq.FigmaPluginMessage) => {}
