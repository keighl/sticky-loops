export const colors = {
	black: '#000000',
	white: '#FFFFFF',
	gray03: '#FAFAFA',
	gray05: '#F2F2F2',
	gray07: '#EDEDED',
	gray10: '#E6E6E6',
	gray15: '#2B2B2B',
	gray20: '#CCCCCC',
	gray30: '#B3B3B3',
	gray40: '#F2F2F2',
	gray50: '#808080',
	gray60: '#666666',
	gray70: '#4D4C4C',
	gray80: '#333333',
	gray90: '#1A1A1A',

	grayBrightness: (brightness: number, alpha: number = 1.0) => {
		const n = brightness * 255
		return `rgba(${n}, ${n}, ${n}, ${alpha})`
	},
}

export const semanticColors = {
	focus: '#0077db',
}

export const fonts = {
	reg: {
		fontFamily: 'Helvetica',
		fontWeight: 400,
		textStyle: 'none',
	},
	med: {
		fontFamily: 'Helvetica',
		fontWeight: 500,
		textStyle: 'none',
	},
	bold: {
		fontFamily: 'Helvetica',
		fontWeight: 700,
		textStyle: 'none',
	},
}

export const typeRamp = {
	reg_12: {
		...fonts.reg,
		fontSize: `${12 / 16}rem`,
		lineHeight: `${16 / 16}rem`,
		letterSpacing: 0,
	},
	reg_14: {
		...fonts.reg,
		fontSize: `${14 / 16}rem`,
		lineHeight: `${20 / 16}rem`,
		letterSpacing: 0,
	},
	reg_16: {
		...fonts.reg,
		fontSize: `${16 / 16}rem`,
		lineHeight: `${24 / 16}rem`,
		letterSpacing: 0,
	},
	reg_18: {
		...fonts.reg,
		fontSize: `${18 / 16}rem`,
		lineHeight: `${24 / 16}rem`,
		letterSpacing: 0,
	},

	med_12: {
		...fonts.med,
		fontSize: `${12 / 16}rem`,
		lineHeight: `${16 / 16}rem`,
		letterSpacing: 0,
	},
	med_14: {
		...fonts.med,
		fontSize: `${14 / 16}rem`,
		lineHeight: `${20 / 16}rem`,
		letterSpacing: 0,
	},
	med_16: {
		...fonts.med,
		fontSize: `${16 / 16}rem`,
		lineHeight: `${24 / 16}rem`,
		letterSpacing: 0,
	},
	med_18: {
		...fonts.med,
		fontSize: `${18 / 16}rem`,
		lineHeight: `${24 / 16}rem`,
		letterSpacing: 0,
	},

	bold_12: {
		...fonts.bold,
		fontSize: `${12 / 16}rem`,
		lineHeight: `${16 / 16}rem`,
		letterSpacing: 0,
	},
	bold_14: {
		...fonts.bold,
		fontSize: `${14 / 16}rem`,
		lineHeight: `${20 / 16}rem`,
		letterSpacing: 0,
	},
	bold_16: {
		...fonts.bold,
		fontSize: `${16 / 16}rem`,
		lineHeight: `${24 / 16}rem`,
		letterSpacing: 0,
	},
	bold_18: {
		...fonts.bold,
		fontSize: `${18 / 16}rem`,
		lineHeight: `${24 / 16}rem`,
		letterSpacing: 0,
	},
}

export const focusStyle = (bgColor: string = '#FFF') => {
	return {
		outline: 'none',
		boxShadow: `0 0 0 2px ${bgColor}, 0 0 0 4px ${semanticColors.focus}`,
	}
}
