/* eslint-disable no-console */
const { spawnSync } = require( 'child_process' )

const wpScripts = require.resolve( '@wordpress/scripts/bin/wp-scripts.js' )

function runBuild( args, nodeEnv ) {
	const result = spawnSync(
		process.execPath,
		[ wpScripts, 'build', ...args ],
		{
			stdio: 'inherit',
			env: {
				...process.env,
				NODE_ENV: nodeEnv,
			},
		}
	)

	if ( result.error ) {
		throw result.error
	}

	if ( result.status !== 0 ) {
		process.exit( result.status || 1 )
	}
}

runBuild( [], 'production' )
runBuild( [ '--env', 'source' ], 'development' )
