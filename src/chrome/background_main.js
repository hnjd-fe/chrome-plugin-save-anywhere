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


	let md5 = [ tab.title + info.selectionText ].join( ' - ' )
    let data = {
		note: `info.selectionText`
		, siteUrl: tab.url
		, siteTitle: tab.title
		, md5: md5
		, width: tab.width.toString()
		, height: tab.height.toString()
	}


	return new Promise( ( resolve, reject ) => {
		try{
			chrome.tabs.executeScript( {
				code: "window.getSelection().toString();"
			}, function(selection) {
				data.note = selection[0];
				data.md5 = [ data.title + data.note ].join( ' - ' ) 

				db.add( data ).then( ( )=> {
					resolve( data );
				}).catch( (err) => {
					reject( err );
				});

			});
		}catch(ex){
			db.add( data ).then( ( )=> {
				resolve( data );
			}).catch( (err) => {
				reject( err );
			});

		}
	});
}

let copyNoti;

function main(){
    if( typeof chrome == 'undefined' ) return;

    var menuItem = chrome.contextMenus.create({
        "id": config.dbName
        , "title": "svae selection text"
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
                addNote( info, tab ).then( (data)=>{
						copyNoti = chrome.notifications.create(
							config.dbName,{   
								type: 'basic', 
								iconUrl: '../assets/img/save-everywhere48.png', 
								title: `${config.dbName} save done!`, 
								message: `${data.note}`
							},
							function() {
								console.log( 'notification done' );
								chrome.notifications.clear( config.dbName, ()=>{
									console.log( 'clear done', Date.now() );
								});
							} 
						);
					}
				);
                break;
            }
        }
    } )
}

