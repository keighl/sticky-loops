import { ReactNode } from 'react'
import { FSUI } from './types'

export const bpmMax = 140
export const bpmMin = 72

type SubdivisionOption = {
	id: string
	icon: ReactNode
}

export const subdivisionOptions: SubdivisionOption[] = [
	{
		id: '8n',
		icon: (
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
				<path
					d="M5.03597 14V2.11511H12.6906V8.96403H8.66187V14H13.6978V0H4.02878V8.96403H0V14H5.03597Z"
					fill="currentColor"
				/>
			</svg>
		),
	},
	{
		id: '16n',
		icon: (
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M4.02878 4.43165V8.96403H0V14H5.03597L5.03597 10.521L5.03597 8.96403L5.03597 4.43165H12.6906L12.6906 8.96403H8.66187V14H13.6978V10.521V8.96403V4.43165V3.1223V0H12.6906H5.03597H4.02878V2.11511V3.1223V4.43165ZM5.03597 3.1223H12.6906V2.11511H5.03597V3.1223Z"
					fill="currentColor"
				/>
			</svg>
		),
	},
	{
		id: '8t',
		icon: (
			<svg width="21" height="14" viewBox="0 0 21 14" fill="none">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M4.02878 0H5.03597H11.9856H12.9928H19.6403H20.6475L20.6475 2.11511L20.6475 8.96403V10.521V14H15.6115V8.96403H19.6403V2.11511H12.9928L12.9928 8.96403L12.9928 10.521L12.9928 14H7.95683V8.96403H11.9856V2.11511H5.03597L5.03597 8.96403L5.03597 10.521L5.03597 14H0V8.96403H4.02878V2.11511V0Z"
					fill="currentColor"
				/>
			</svg>
		),
	},
	{
		id: '16t',
		icon: (
			<svg width="21" height="14" viewBox="0 0 21 14" fill="none">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M5.03597 0H4.02878V2.11511V8.96403H0V14H5.03597L5.03597 10.521L5.03597 8.96403L5.03597 4.43165H11.9856V8.96403H7.95683V14H12.9928L12.9928 10.521L12.9928 8.96403L12.9928 4.43165H19.6403V8.96403H15.6115V14H20.6475V10.521V8.96403L20.6475 4.43165V3.1223V2.11511L20.6475 0H19.6403H12.9928H11.9856H5.03597ZM11.9856 3.1223H5.03597V2.11511H11.9856V3.1223ZM19.6403 3.1223H12.9928V2.11511H19.6403V3.1223Z"
					fill="currentColor"
				/>
			</svg>
		),
	},
]

export const subdivisionOptionsById = subdivisionOptions.reduce<
	Record<string, SubdivisionOption>
>((result, option) => {
	return {
		...result,
		[option.id]: option,
	}
}, {})

type KitOption = {
	id: string
	name: string
}

export const KIT_FRAME_808: FSUI.KitID = 'kit_frame808'
export const KIT_SPACE_BEWTWEEN: FSUI.KitID = 'kit_spaceBetween'
export const KIT_CONGA_AS_PNG: FSUI.KitID = 'kit_congaAsPNG'
export const KIT_DOCUMENT_COLORS: FSUI.KitID = 'kit_documentColors'

export const kits: KitOption[] = [
	{
		id: KIT_FRAME_808,
		name: 'Frame 808',
	},
	{
		id: KIT_SPACE_BEWTWEEN,
		name: 'Space Between',
	},
	{
		id: KIT_CONGA_AS_PNG,
		name: 'Conga as PNG',
	},
	{
		id: KIT_DOCUMENT_COLORS,
		name: 'Document Colors',
	},
]

export const kitsByID = kits.reduce<Record<FSUI.KitID, KitOption>>(
	(result, option) => {
		return {
			...result,
			[option.id]: option,
		}
	},
	{} as Record<FSUI.KitID, KitOption>
)
