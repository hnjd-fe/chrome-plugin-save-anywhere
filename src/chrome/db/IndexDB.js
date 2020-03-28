import BaseDB from './BaseDB.js'
import Dexie from '../utils/dexie.js'
import md5 from '../utils/md5.js'
import config from '../config.js'
import IDBExportImport from '../utils/indexeddb-export-import.js'
import moment from '../utils/moment.js'
import saveAs from '../utils/FileSaver.js'

import sync_data from '../data/sync_data.js';
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true

export default class IndexDB extends BaseDB {
    constructor( dbType ){
        super( 'IndexedDB' )
    }

    init(){
        console.log( 'method from IndexDB' )
    }

    isLogin() {
        return localStorage.getItem( 'uid' ) && localStorage.getItem( 'token' );
    }

    topList( limit = 50 ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            resolve( db[config.dbDataTableName].orderBy('updateDate').reverse().limit( limit  ).toArray() );
        });
    }

	fixStatus( data ){
		data.map( ( item ) => {
			item.status = item.status ? true : false;
		});
		return data;
	}

    fullList( page = 1, size = 50, id, status, type = -1, searchText = '' ){
        let offset = ( page - 1 ) * size;

        //console.log( 'fullList', page, size, id, typeof status );

        if( id ){
            return new Promise( ( resolve, reject ) => {
                let db = this.getDB();
                db[config.dbDataTableName].where('id').equals( parseInt( id ) ).toArray().then( ( data )=>{
					this.fixStatus( data );
                    resolve( { data: data, total: data.length }
                    );
                });
            });

        }

        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db[config.dbDataTableName].count(( count )=>{
                let query = db[config.dbDataTableName].orderBy('updateDate').reverse();

                if( searchText ){
                    query.filter( ( item ) => {
                        return item.note.indexOf( searchText ) > -1;
                    });
                }

                if( typeof status == 'boolean' ){
					let statusNum = status ? 1 : 0;
					query = query.filter( ( item ) => {
                        if( !('status' in item ) && statusNum === 0 ){
                            return true;
                        }
						return item.status == statusNum;
					});
				}
				if( type > -1 ){
					query = query.filter( ( item ) => {
						return item.type == type;
					});
                }
                
                console.log('status', status, query )

              	query.offset( offset ).limit( size ).toArray().then( ( data )=>{
					this.fixStatus( data );
                    resolve( 
                        { data: data, total: data.length }
                    );
                });
            });
        });
    }

    search( text ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            //resolve( db[config.dbDataTableName].orderBy('updateDate').reverse().limit( limit  ).toArray() );

            let r = [];

            db[config.dbDataTableName]
                .orderBy('updateDate')
                .each( ( note )=>{
                    //console.log( notes );
                    let ltext = text.toLowerCase();
                    if( 
                        ( note.note && (note.note).toLowerCase().indexOf( ltext ) > -1 )
                        || ( note.siteTitle && (note.siteTitle ).toLowerCase().indexOf( ltext ) > -1 )
                    ){
                        r.unshift( note );
                    }
                }).then( ()=>{
                    resolve( r );
                });;

            //resolve( [] );
        });
    }

    getDB(){
        let db = new Dexie( config.dbName );
        db.version(1).stores({
            [`${config.dbDataTableName}`]: "++id,note,siteUrl,siteTitle,tags,remark,width,height,md5,createDate,updateDate,status"
        });
        return db;
    }

    deleteDB(){
        Dexie.delete( config.dbName )
    }

    total(){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db[config.dbDataTableName].count().then( ( total  )=>{
                resolve( total )
            } ).catch( ( err )=>{
                reject( err )
            } )
        })
    }

    update( id, json ) {
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
			let r;
            json.status = json.status ? 1 : 0;
            json.updateDate = Date.now();
            db.transaction( 'rw', db[config.dbDataTableName], () => {
               db[config.dbDataTableName].where('id').equals( parseInt( id ) ).modify( ( data )=>{
			   		for( let k in json ){
						data[k] = json[k];
					}
					console.log( 'indexdb update', data );
                }).then( ()=>{
                    console.log( 'update', id, json, json.md5 );
                   if( this.isLogin() && json.md5 ){
                       delete json.nid;
                       axios.post( `${config.apiUrl}/?s=/Index/Data/update&rnd=` + Date.now(), qs.stringify({
                            ...json
                            , uid: localStorage.getItem( 'uid' )
                            , token: localStorage.getItem( 'token' )
                        })).then( (res)=>{
                        });
                    }
                    resolve( json );
                });;
            });
        });
	}

    deleteItem( id, md5 ) {
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db[config.dbDataTableName]
                .where( 'id' )
                .equals( id )
                .delete()
                .then( ( data )=>{
                    console.log( 'delete', id, data, md5 );
                   if( this.isLogin() && md5 ){
                       axios.post( `${config.apiUrl}/?s=/Index/Data/del&rnd=` + Date.now(), qs.stringify({
                            uid: localStorage.getItem( 'uid' )
                            , token: localStorage.getItem( 'token' )
                            , md5: md5
                        })).then( (res)=>{
                            this.parseRequestData( res, ()=>{
                                resolve();
                            });
                        });
                    }

                    resolve( id );
                })
                .catch( (err)=>{
                    reject( err, id );
                });
        });
    }

    add( json = {} ) {
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            let dateStr = Date.now(); 
            let dataItem =  Object.assign( {
                note: '' 
                , md5: '' 
                , siteUrl: '' 
                , siteTitle: ''
                , tags: ''
                , remark: ''
                , width: 100
                , height: 100
                , createDate: dateStr
                , updateDate: dateStr
                , status: 1
                }
                , json 
            );
            console.log( 'data added:', dataItem );
            db[config.dbDataTableName].add( dataItem ).then(()=>{
                if( this.isLogin() ){
                    axios.post( `${config.apiUrl}/?s=/Index/Data/add`, qs.stringify({
                        uid: localStorage.getItem( 'uid' )
                        , token: localStorage.getItem( 'token' )
                        , siteUrl: dataItem.siteUrl
                        , siteTitle: dataItem.siteTitle
                        , note: dataItem.note
                        , remark: dataItem.remark
                        , updateDate: parseInt( dataItem.updateDate)
                        , createDate: parseInt( dataItem.createDate )
                        , height: parseInt( dataItem.height )
                        , width: parseInt( dataItem.width )
                        , tags: dataItem.tags
                        , md5: dataItem.md5
                        , status: dataItem.status ? 1 : 0
                    })).then( (res)=>{
                        this.parseRequestData( res );
                    });
                }
                resolve( dataItem )
            }).catch(function (e) {
                reject( e )
            });
        });
    }

    batchAdd( data ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();

            db[config.dbDataTableName].bulkAdd( data ).then(function() {
                resolve( data )
            }).catch(function (e) {
                reject( e )
            });
        });
    }

    sync( returnUrl ) {
        return new Promise( ( resolve, reject ) => {
            if( !this.isLogin() ){
                resolve();
                return;
            }
            let db = this.getDB();
            db[config.dbDataTableName].toArray().then( ( data )=>{
                console.log( data );

                let md5 = {};

                data.map( ( item ) => {
                    delete item.id;
                    delete item.nid;
                    md5[ item.md5 ] = item
                });
                
               axios.post( `${config.apiUrl}/?s=/Index/Data/sync&rnd=` + Date.now(), qs.stringify({
                    uid: localStorage.getItem( 'uid' )
                    , token: localStorage.getItem( 'token' )
                    , md5: JSON.stringify( md5 )
                })).then( (res)=>{
                    console.log( 'sync', Date.now(), res );
                    // return;
                    this.parseRequestData( res, ()=>{
                        resolve();
                    }, returnUrl);
                });
                /*
                this.parseRequestData( {data:sync_data}, ()=>{
                    resolve();
                });
                */
            }).catch(function (e) {
                reject( e )
            });
        });
    }

    batchDelete( key, list ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db[config.dbDataTableName].where( key ).anyOf( list ).delete().then( ( data )=>{
                resolve();
            });
        });
    }

    batchPush( key, list ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();

            console.log( 'x1' );
            db[config.dbDataTableName].where( key ).anyOf( list ).toArray().then( ( data )=>{
                if( this.isLogin() ){
                    console.log( 'x2' );
                    data.map( (item)=>{
                        delete item.id;
                        delete item.nid;
                        item.uid = localStorage.getItem( 'uid' );
                        item.token = localStorage.getItem( 'token' );
                    });

                    axios.post( `${config.apiUrl}/?s=/Index/Data/batchAdd`, qs.stringify({
                        uid: localStorage.getItem( 'uid' )
                        , token: localStorage.getItem( 'token' )
                        , data: JSON.stringify( data )
                    })).then( (res)=>{
                        resolve();
                    });
                }
            }).catch(function (e) {
                reject( e )
            });
        });

    }

    parseRequestData( res, cb, returnUrl ){
        if( res && res.data && res.data.errno === 1 ){
            this.logout();
            return;
        }
        if( res && res.data && res.data.errno === 2 ){
            this.logout();
            return;
        }

        this.refresh = 0;

        if( res && res.data && res.data.errno === 0 ){
            console.log( 'res.data', res.data );

            if( res.data && res.data && res.data.data ) {
                if(  res.data.data.sync && res.data.data.sync.length ){
                    let md5List = [];
                    res.data.data.sync.map( (item)=>{
                        md5List.push( item.md5 );
                    });
                    this.batchDelete( 'md5', md5List ).then( ()=>{
                        this.batchAdd( res.data.data.sync ).then( ( data )=>{
                            this.refresh++;
                            this.checkRefresh(returnUrl);
                        });
                    });
                }else{
                    this.refresh++;
                    this.checkRefresh(returnUrl);
                }
                if( res.data.data.deleted && res.data.data.deleted.length ){
                    this.batchDelete( 'md5', res.data.data.deleted ).then( ()=>{
                        this.refresh++;
                        this.checkRefresh(returnUrl);
                    });
                }else{
                    this.refresh++;
                    this.checkRefresh(returnUrl);
                }

                console.log( 'news', res.data.data.news );
                if( res.data.data.news && res.data.data.news.length ){
                    this.batchPush( 'md5', res.data.data.news).then( ()=>{
                        this.refresh++;
                        this.checkRefresh(returnUrl);
                    });
                }else{
                    this.refresh++;
                    this.checkRefresh(returnUrl);
                }

                if( res.data.data.update && res.data.data.update.length ){
                    this.batchUpdate( res.data.data.update).then( ()=>{
                        this.refresh++;
                        this.checkRefresh(returnUrl);
                    });
                }else{
                    this.refresh++;
                    this.checkRefresh(returnUrl);
                }


            }
        }

        cb && cb( res.data );
    }

    checkRefresh(returnUrl){
        if( this.refresh === 4 ){
            if( returnUrl ){
                location.replace( returnUrl );
            }else{
                location.reload();
            }
        }
    }

    logout(){
		localStorage.removeItem( 'token' );
		localStorage.removeItem( 'md5' );
		localStorage.removeItem( 'username' );
		localStorage.removeItem( 'nickname' );
		localStorage.removeItem( 'email' );
		localStorage.removeItem( 'logintype' );
		localStorage.removeItem( 'uid' );

        location.reload();
    }

    dataGenerator( limit = 10000 ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            let listData = [];

            for( let i = 0; i < limit; i++ ){
                let tmpNote = 'note' + i;
                let dateStr = ( Date.now() + i )
                listData.push( {
                    note: tmpNote
                    , md5: md5( tmpNote )
                    , status: Math.round( Math.random() )
                    , type: parseInt( Math.random() * 4 )
                    , tags: ''
                    , remark: ''
                    , width: "100"
                    , height: "100"
                    , createDate: dateStr
                    , updateDate: dateStr
                } )
            }

            db[config.dbDataTableName].bulkAdd( listData).then(function() {
                console.log( 'dataGenerator successfully', limit )
                resolve( listData )
            }).catch(function (e) {
                console.error("dataGenerator Error: " + (e.stack || e));
                reject( e )
            });
        });
    }

    clearData(){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db.open().then( ()=>{
                var idb_db = db.backendDB();
                IDBExportImport.clearDatabase(idb_db, function(err) {
                    if (!err){
                        resolve();
                    }else{
                        reject( err  );
                    }
                });
            } )
        }) ;
    }

    fixmd5Data (){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            let r = [];
            db.transaction( 'rw', db[config.dbDataTableName], () => {
               db[config.dbDataTableName].toCollection().modify( ( data )=>{
                    data.md5 = md5( [ data.siteTitle + data.note ].join( ' - ' ) )
                    r.push( data );
                }).then( ()=>{
                    resolve( r );
                });;
            });
        });
    }

    fixdateData (){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            let r = [];
            db.transaction( 'rw', db[config.dbDataTableName], () => {
               db[config.dbDataTableName].toCollection().modify( ( data )=>{
                    data.createDate = parseInt( data.createDate );
                    data.updateDate = parseInt( data.updateDate );
                    r.push( data );
                }).then( ()=>{
                    resolve( r );
                });;
            });
        });
    }


    backup(){
        return new Promise( (resolve, reject) => {
            let db = this.getDB();
            db.open().then( ()=>{
                var idb_db = db.backendDB();
                IDBExportImport.exportToJsonString(idb_db, function(err, jsonString) {
                    if(err){
                        console.error(err);
                        reject( err )
                    } else {
                        var blob = new Blob([jsonString], {type: "text/plain;charset=utf-8"});
                        saveAs(blob, `${config.dbName}_${moment().format('YYYYMMDD')}.json`);
                        resolve( jsonString );
                    }
                });
            } )
        });
    }
    restore( result, cleanData  ){
        return new Promise( ( resolve, reject ) => {

            let db = this.getDB();
            db.open().then( ()=>{
                var idb_db = db.backendDB();
                if( cleanData ){
                    IDBExportImport.clearDatabase(idb_db, function(err) {
                        IDBExportImport.importFromJsonString(idb_db, result, function(err) {
                            if (err){
                                console.error( err );
                                reject( err  );
                            }else{
                                resolve( result );
                            }
                        });
                    });
                }else{
                    let importData = { src: JSON.parse( result ), map: {} };
                    let newData = [];

                    if( importData.src && importData.src.notes && importData.src.notes.length ){

                        db[config.dbDataTableName].toArray().then( ( data )=>{
                            data.map( ( sitem, six ) => {
                                importData.map[ sitem.md5 ] = sitem;
                            });

                            importData.src.notes.map( ( item, ix ) => {
                                delete item.id;
                                if( !(item.md5 in importData.map) ){
                                    newData.push( item );
                                    console.log( 'newItem:', item );
                                }
                            });

                            if( !newData.length ){
                                resolve( newData );
                                return;
                            }

                            db[config.dbDataTableName].bulkAdd( newData ).then(function() {
                                resolve( newData )
                            }).catch(function (e) {
                                console.error("resolve Error: " + (e.stack || e));
                                reject( e )
                            });


                        });

                    }
                }
                /*
                */
            } )
        } )
    }
}

