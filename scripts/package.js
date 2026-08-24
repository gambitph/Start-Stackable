/* eslint-disable no-console */
const fs = require( 'fs' )
const path = require( 'path' )
const archiver = require( 'archiver' )

const THEME_SLUG = 'start-stackable'
const BUILD_ROOT = 'build'
const BUILD_DIR = path.join( BUILD_ROOT, THEME_SLUG )
const DIST_DIR = 'dist'

let folderSuffix = ''
if ( process.argv.length === 3 ) {
	folderSuffix = process.argv[ process.argv.length - 1 ]
}

const INDEX_PHP_CONTENT = `<?php
// Silence is golden.
`

const INCLUDED_FILES = [
	'style.css',
	'theme.json',
	'readme.txt',
	'functions.php',
	'screenshot.png',
	'screenshot.jpg',
]

const INCLUDED_DIRS = [
	'templates',
	'parts',
	'styles',
	'patterns',
	'assets',
	'fonts',
	'languages',
]

function ensureDir( dir ) {
	if ( ! fs.existsSync( dir ) ) {
		fs.mkdirSync( dir, { recursive: true } )
	}
}

function copyFile( src, dest ) {
	ensureDir( path.dirname( dest ) )
	fs.copyFileSync( src, dest )
}

function copyDir( src, dest ) {
	if ( ! fs.existsSync( src ) ) {
		return
	}

	ensureDir( dest )

	for ( const item of fs.readdirSync( src ) ) {
		if ( item.startsWith( '.' ) || item.endsWith( '.map' ) ) {
			continue
		}

		const srcPath = path.join( src, item )
		const destPath = path.join( dest, item )
		const stat = fs.statSync( srcPath )

		if ( stat.isDirectory() ) {
			copyDir( srcPath, destPath )
		} else {
			copyFile( srcPath, destPath )
		}
	}
}

function addSecurityIndexFiles( dir ) {
	if ( ! fs.existsSync( dir ) ) {
		return
	}

	for ( const item of fs.readdirSync( dir ) ) {
		const itemPath = path.join( dir, item )
		if ( ! fs.statSync( itemPath ).isDirectory() ) {
			continue
		}

		const indexPath = path.join( itemPath, 'index.php' )
		if ( ! fs.existsSync( indexPath ) ) {
			fs.writeFileSync( indexPath, INDEX_PHP_CONTENT )
		}

		addSecurityIndexFiles( itemPath )
	}
}

function readThemeVersion() {
	const styleCss = fs.readFileSync( 'style.css', 'utf8' )
	const versionMatch = styleCss.match( /^Version:\s*([^\r\n]+)/m )
	if ( ! versionMatch ) {
		throw new Error( 'Could not find Version in style.css' )
	}
	return versionMatch[ 1 ].trim()
}

function applyVersionSuffix( buildDir, suffix ) {
	if ( ! suffix ) {
		return
	}

	const stylePath = path.join( buildDir, 'style.css' )
	let style = fs.readFileSync( stylePath, 'utf8' )
	style = style.replace(
		/^(Version:\s*)([^\r\n]+)/m,
		( match, prefix, version ) => {
			if ( ! version.includes( suffix ) ) {
				return prefix + version + '-' + suffix
			}
			return match
		}
	)
	fs.writeFileSync( stylePath, style )
	console.log( `Updated packaged style.css Version with suffix: ${ suffix }` )
}

function syncPackagedReadmeStableTag( buildDir ) {
	const stylePath = path.join( buildDir, 'style.css' )
	const readmePath = path.join( buildDir, 'readme.txt' )
	if ( ! fs.existsSync( stylePath ) || ! fs.existsSync( readmePath ) ) {
		return
	}

	const style = fs.readFileSync( stylePath, 'utf8' )
	const versionMatch = style.match( /^Version:\s*([^\r\n]+)/m )
	if ( ! versionMatch ) {
		return
	}

	const version = versionMatch[ 1 ].trim()
	const readme = fs.readFileSync( readmePath, 'utf8' )
	if ( ! /^Stable tag:\s*[^\r\n]+/m.test( readme ) ) {
		console.log( 'Could not find "Stable tag:" line in packaged readme.txt' )
		return
	}

	const updated = readme.replace(
		/^Stable tag:\s*[^\r\n]+/m,
		`Stable tag: ${ version }`
	)

	if ( updated === readme ) {
		console.log( `Packaged readme.txt Stable tag already ${ version }` )
		return
	}

	fs.writeFileSync( readmePath, updated )
	console.log( `Updated packaged readme.txt Stable tag to ${ version }` )
}

async function packageTheme() {
	const themeVersion = readThemeVersion()
	const packagedVersion = folderSuffix ? `${ themeVersion }-${ folderSuffix }` : themeVersion
	const zipFolderName = THEME_SLUG + ( folderSuffix ? `-${ folderSuffix }` : '' )

	console.log( 'Starting theme packaging...' )
	console.log( `Version: ${ packagedVersion }` )

	if ( fs.existsSync( BUILD_ROOT ) ) {
		fs.rmSync( BUILD_ROOT, { recursive: true } )
	}
	ensureDir( BUILD_DIR )

	console.log( 'Copying theme files...' )
	for ( const file of INCLUDED_FILES ) {
		if ( fs.existsSync( file ) && fs.statSync( file ).isFile() ) {
			copyFile( file, path.join( BUILD_DIR, file ) )
		}
	}

	for ( const dir of INCLUDED_DIRS ) {
		if ( fs.existsSync( dir ) && fs.statSync( dir ).isDirectory() ) {
			copyDir( dir, path.join( BUILD_DIR, dir ) )
		}
	}

	if ( ! fs.existsSync( path.join( BUILD_DIR, 'functions.php' ) ) ) {
		throw new Error( 'Packaged theme is missing functions.php' )
	}
	if ( fs.existsSync( path.join( BUILD_DIR, 'function.php' ) ) ) {
		throw new Error( 'Packaged theme must not include function.php' )
	}
	if ( ! fs.existsSync( path.join( BUILD_DIR, 'style.css' ) ) ) {
		throw new Error( 'Packaged theme is missing style.css' )
	}
	if ( ! fs.existsSync( path.join( BUILD_DIR, 'theme.json' ) ) ) {
		throw new Error( 'Packaged theme is missing theme.json' )
	}
	if ( ! fs.existsSync( path.join( BUILD_DIR, 'templates', 'index.html' ) ) ) {
		throw new Error( 'Packaged theme is missing templates/index.html' )
	}

	if ( fs.existsSync( 'src' ) && ! fs.existsSync( path.join( BUILD_DIR, 'assets', 'build', 'frontend.asset.php' ) ) ) {
		throw new Error( 'Compiled assets missing. Run npm run compile before packaging.' )
	}

	applyVersionSuffix( BUILD_DIR, folderSuffix )
	syncPackagedReadmeStableTag( BUILD_DIR )

	console.log( 'Adding directory index.php files...' )
	addSecurityIndexFiles( BUILD_DIR )

	console.log( 'Creating zip package...' )
	ensureDir( DIST_DIR )

	const zipPath = path.join( DIST_DIR, `${ THEME_SLUG }-${ packagedVersion }.zip` )
	if ( fs.existsSync( zipPath ) ) {
		fs.unlinkSync( zipPath )
	}

	const output = fs.createWriteStream( zipPath )
	const archive = archiver( 'zip', { zlib: { level: 9 } } )

	const done = new Promise( ( resolve, reject ) => {
		output.on( 'close', resolve )
		output.on( 'error', reject )
		archive.on( 'error', reject )
	} )

	archive.pipe( output )
	archive.directory( BUILD_DIR, zipFolderName )
	await archive.finalize()
	await done

	const size = ( archive.pointer() / 1024 / 1024 ).toFixed( 2 )
	console.log( 'Theme packaged successfully.' )
	console.log( `Theme tree: ${ BUILD_DIR }` )
	console.log( `Package: ${ zipPath }` )
	console.log( `Size: ${ size } MB` )
}

packageTheme().catch( err => {
	console.error( err )
	process.exit( 1 )
} )
