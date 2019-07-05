console.log( 'background', Date.now() );

import config from './config.js';
import db from './db.js';
import md5 from './utils/md5.js'

main();

/*
{
  "info": {
    "editable": false,
    "frameId": 0,
    "menuItemId": "save-anywhere",
    "pageUrl": "chrome://extensions/",
    "selectionText": "ID：opkoninacfpinfmklefkfdklgdebdoen"
  },
  "tag": {
    "active": true,
    "audible": false,
    "autoDiscardable": true,
    "discarded": false,
    "favIconUrl": "",
    "height": 946,
    "highlighted": true,
    "id": 538,
    "incognito": false,
    "index": 0,
    "mutedInfo": {
      "muted": false
    },
    "pinned": false,
    "selected": true,
    "status": "complete",
    "title": "扩展程序",
    "url": "chrome://extensions/",
    "width": 932,
    "windowId": 29
  }
}
*/

function addNote(info, tab) {
	console.log( 'addNote', Date.now() );

	let note = [ tab.title + info.selectionText ].join( ' - ' )

	db.add( {
		note: note
		, siteUrl: tab.url
		, siteTitle: tab.title
		, md5: md5( note )
		, width: tab.width.toString()
		, height: tab.height.toString()
	} );
}

function main(){
    if( typeof chrome == 'undefined' ) return;

    var menuItem = chrome.contextMenus.create({
        "id": config.dbName
        , "title": "svae your selection text"
        , "contexts": ["selection"]
    });

    /*
    var child1 = chrome.contextMenus.create( {
        "id": "save text"
        , "title": "save text"
        , "parentId": menuItem
        , "contexts": ["selection"]
    });
    */

    chrome.contextMenus.onClicked.addListener( function(info, tab){
        switch( info.menuItemId ){
            case config.dbName: {
                addNote( info, tab );
                break;
            }
        }
    } )
}

