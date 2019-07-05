#! /usr/bin/env node

const fs = require( 'fs' )
const path = require( 'path' )

const curDir = __dirname;
const rootDir = path.resolve( curDir, '../../' );

const patchFile = path.resolve( curDir, 'patch.js' );

const fixFileList = [
    path.resolve( rootDir, 'save-anywhere/js/background.js' )
]

const patchContent = fs.readFileSync( patchFile, { encoding: 'utf8' } );

/*
console.log( 'finishbuild main', Date.now() )
console.log( curDir )
console.log( rootDir )

console.log( patchContent )
*/

for( let i = 0, j = fixFileList.length; i < j; i++ ){
    let tmpFilePath = fixFileList[ i ]
    let tmpFileContent = fs.readFileSync( tmpFilePath, { encoding: 'utf8' } );

   tmpFileContent = tmpFileContent.replace( patchContent, '' );

   tmpFileContent = [ tmpFileContent, patchContent ].join( '\n' );

   fs.writeFileSync( tmpFilePath, tmpFileContent, { encoding: 'utf8' } )
}
