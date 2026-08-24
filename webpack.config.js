const path = require( 'path' )
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' )

const config = Array.isArray( defaultConfig ) ? defaultConfig[ 0 ] : defaultConfig

/**
 * Compile src/ into assets/build/.
 * The zip copies assets/ (compiled) and never src/.
 */
module.exports = {
	...config,
	entry: {
		frontend: path.resolve( __dirname, 'src/frontend.js' ),
	},
	output: {
		...config.output,
		path: path.resolve( __dirname, 'assets/build' ),
	},
}
