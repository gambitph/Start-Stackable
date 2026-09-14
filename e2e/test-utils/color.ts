export function getContrastRatio( foreground: string, background: string ) {
	const luminance = ( color: string ) => {
		const channels = color.match( /\d+(?:\.\d+)?/g )?.slice( 0, 3 ).map( Number )
		if ( ! channels || channels.length !== 3 ) {
			throw new Error( `Expected an RGB color, received ${ color }` )
		}

		const [ red, green, blue ] = channels.map( ( channel ) => {
			const value = channel / 255
			return value <= 0.04045 ? value / 12.92 : ( ( value + 0.055 ) / 1.055 ) ** 2.4
		} )

		return 0.2126 * red + 0.7152 * green + 0.0722 * blue
	}

	const foregroundLuminance = luminance( foreground )
	const backgroundLuminance = luminance( background )
	const lighter = Math.max( foregroundLuminance, backgroundLuminance )
	const darker = Math.min( foregroundLuminance, backgroundLuminance )

	return ( lighter + 0.05 ) / ( darker + 0.05 )
}
