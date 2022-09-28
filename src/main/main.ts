import readScene from './readScene'
import { FS } from '../types'

figma.showUI(__html__, {})

const parseThenPlay = (selection: readonly SceneNode[]) => {
	let stickyNotes: FS.StickyNoteData[] = []

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
		stickyNotesChunk: FS.StickyNoteData[],
		done: boolean
	) => {
		// Pump the results into our map
		stickyNotes = [...stickyNotes, ...stickyNotesChunk]

		// If this is the last chunk...
		if (done) {
			// Figure out the arrangement of the stickies!
			// we're looking to identify columns that will
			// fire together on the sequence

			// Organize the stickies into columns
			// based on layout
			type StickyColumn = {
				minX: number
				maxX: number
				meanX: number
				stickyNotes: FS.StickyNoteData[]
			}

			let columns: StickyColumn[] = []

			// Start with the topmost stickies
			const sortedByY = stickyNotes.sort((a, b) => a.rect.y - b.rect.y)

			sortedByY.forEach((sticky) => {
				const stickyMinX = sticky.rect.x
				const stickyMaxX = sticky.rect.x + sticky.rect.width

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
					matchedColumn.stickyNotes = [...matchedColumn.stickyNotes, sticky]
					columns[columnMatches[0].index] = matchedColumn
				} else {
					// Doesn't fit any existing columns, so add a new one
					const newColumn: StickyColumn = {
						minX: stickyMinX,
						maxX: stickyMaxX,
						meanX: (stickyMinX + stickyMaxX) / 2.0,
						stickyNotes: [sticky],
					}

					columns = [...columns, newColumn]
				}
			})

			// Sort the columns left to right
			const sortedColumns = columns.sort((a, b) => a.minX - b.minX)

			const dedupedColumns: FS.StepData.Column[] = sortedColumns.map(
				(column) => {
					const { stickyNotes } = column
					const stepDataColumn: FS.StepData.Column = {
						sounds: Object.keys(
							stickyNotes.reduce<Record<string, boolean>>(
								(results, stickyNote) => {
									return { ...results, [stickyNote.color]: true }
								},
								{}
							)
						).map((color) => {
							const sound: FS.StepData.Sound = {
								color,
							}
							return sound
						}),
					}
					return stepDataColumn
				}
			)

			// 2) Send the data off to the UI
			// and trigger the index resolver
			console.log('FS_', 'readScene COMPLETE')
			const message: FS.PluginMessage<FS.StepData.Column[]> = {
				command: 'play_instructions',
				data: dedupedColumns,
			}
			figma.ui.postMessage(message)
			resolveParsing()
		}
	}

	// Read the selection
	readScene(selection, handSceneChunk).then(() =>
		console.log('FS_', 'readScene START')
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

figma.ui.onmessage = (message: FS.PluginMessage<null>) => {}
