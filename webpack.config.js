const path = require( 'path' )
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' )

const config = Array.isArray( defaultConfig ) ? defaultConfig[ 0 ] : defaultConfig
const entryPath = path.resolve( __dirname, 'src/frontend.js' )
const outputPath = path.resolve( __dirname, 'assets/build' )

/**
 * Compile the runtime bundle and its readable counterpart.
 */
module.exports = ( env = {} ) => {
	const isSourceBuild = Boolean( env.source )
	const entryName = isSourceBuild ? 'frontend-source' : 'frontend'

	return {
		...config,
		mode: isSourceBuild ? 'development' : config.mode,
		devtool: false,
		entry: {
			[ entryName ]: entryPath,
		},
		optimization: {
			...config.optimization,
			...( isSourceBuild && { minimize: false } ),
		},
		output: {
			...config.output,
			path: outputPath,
			clean: isSourceBuild ? false : config.output.clean,
		},
	}
}
