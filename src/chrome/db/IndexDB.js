import BaseDB from './BaseDB.js'
import Dexie from '../utils/dexie.js'
import md5 from '../utils/md5.js'
import config from '../config.js'
import IDBExportImport from '../utils/indexeddb-export-import.js'
import moment from '../utils/moment.js'
import saveAs from '../utils/FileSaver.js'

import qs from '../utils/qs.js';

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

    fullList( page = 1, size = 50, id ){
        let offset = ( page - 1 ) * size;

        console.log( 'fullList', page, size, id );

        if( id ){
            return new Promise( ( resolve, reject ) => {
                let db = this.getDB();
                db[config.dbDataTableName].where('id').equals( parseInt( id ) ).toArray().then( ( data )=>{
                    console.log( data, id );
                    
                    resolve( { data: data, total: data.length }
                    );
                });
            });

        }

        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db[config.dbDataTableName].count(( count )=>{
                db[config.dbDataTableName].orderBy('updateDate').reverse().offset( offset ).limit( size ).toArray().then( ( data )=>{
                    resolve( 
                        { data: data, total: count }
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
            [`${config.dbDataTableName}`]: "++id,note,siteUrl,siteTitle,tags,remark,width,height,md5,createDate,updateDate"
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

    deleteItem( id ) {
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            db[config.dbDataTableName]
                .where( 'id' )
                .equals( id )
                .delete()
                .then( ()=>{
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
            let dateStr = Date.now().toString(); 
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
                }
                , json 
            );
            console.log( 'data added:', dataItem );
            db[config.dbDataTableName].add( dataItem ).then(()=>{
                if( this.isLogin() ){
                    axios.post( 'http://btbtd.org/api/saveanywhere/?s=/Index/Data/add', {
                        uid: localStorage.getItem( 'uid' )
                        , token: localStorage.getItem( 'token' )
                        , site_url: dataItem.siteUrl
                        , site_title: dataItem.siteTitle
                        , note: dataItem.note
                        , remark: dataItem.remark
                        , update_date: parseInt( dataItem.updateDate)
                        , create_date: parseInt( dataItem.createDate )
                        , height: parseInt( dataItem.height )
                        , width: parseInt( dataItem.width )
                        , tags: dataItem.tags
                        , md5: dataItem.md5
                    }).then( (res)=>{
                        this.parseRequestData( res );
                    });
                }
                resolve( dataItem )
            }).catch(function (e) {
                reject( e )
            });
        });
    }

    sync() {
        return new Promise( ( resolve, reject ) => {
            if( !this.isLogin() ){
                resolve();
                return;
            }
            let db = this.getDB();
            db[config.dbDataTableName].toArray().then( ( data )=>{
                console.log( data );
                if( !data.length ){
                    resolve( [] );
                    return;
                }

                let md5 = {};

                data.map( ( item ) => {
                    md5[ item.md5 ] = item.id;
                });

                console.log( md5 );

               axios.post( 'http://btbtd.org/api/saveanywhere/?s=/Index/Data/sync&rnd=' + Date.now(), {
                    uid: localStorage.getItem( 'uid' )
                    , token: localStorage.getItem( 'token' )
                    , md5: JSON.stringify( md5 )
                }).then( (res)=>{
                    this.parseRequestData( res );
                });


                //resolve()
            }).catch(function (e) {
                reject( e )
            });
        });
    }

    parseRequestData( res ){
        if( res && res.data && res.data.errno === 1 ){
            //this.logout();
            return;
        }
        if( res && res.data && res.data.errno === 2 ){
            this.logout();
            return;
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
    }

    dataGenerator( limit = 10000 ){
        return new Promise( ( resolve, reject ) => {
            let db = this.getDB();
            let listData = [];

            for( let i = 0; i < limit; i++ ){
                let tmpNote = 'note' + i;
                let dateStr = ( Date.now() + i ).toString();
                listData.push( {
                    note: tmpNote
                    , md5: md5( tmpNote )
                    , siteUrl: 'index.html'
                    , siteTitle: '-'
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

