
import db from '@src/chrome/db.js'
import typemap from '@src/data/typemap.js'
import moment from '@src/chrome/utils/moment.js'
import md5 from '@src/chrome/utils/md5.js'

let mixin = {
    data() {
        return {
			typemap
            , addVisible: [ false, false, false, false ]
			, itemjson: null
            , addVisible: [ false, false, false, false ]
            , tmer: 0
        }
    }
    , methods: {
        moment
        , clone( json ){
            return JSON.parse( JSON.stringify( json ) );
        }
        , addItem( json ) {
            json.md5 = md5( json.note + Date.now() );
            //console.log( 'addItem', json );
            return new Promise( ( resolve, reject ) => {
                db.add( json ).then( ( json )=> {
                    resolve( json );
                }).catch( ()=>{
                    reject( json );
                });
            });
        }
        , onAddItem( evt, type ) {
            this.$set( this.addVisible, type, !this.addVisible[ type ]  );
        }

		, onEditItem( type, item, sindex ) {
			//console.log( 'onEditItem', type, item, sindex );
			this.itemjson = item;
		}
		, closeEdit() {
			this.itemjson = null;
		}
		, updateList( json, type, item ){
			this.tmer && clearTimeout( this.tmer );

			this.tmer = setTimeout( ()=>{
				this.updateFullList( 1, this.$route.query.id );
			}, 50 );
		}

        , updateItem( id, json ) {
            return new Promise( ( resolve, reject ) => {
                db.update( id, json ).then( ( r )=> {
                    resolve( r );
                }).catch( ()=>{
                    reject( json );
                });
            });
        }
        , deleteItem( id, md5 ) {
            return new Promise( ( resolve, reject ) => {
                db.deleteItem( id, md5 ).then( ()=> {
                    resolve( id, md5 );
                }).catch( ()=>{
                    reject( id );
                });
            });
        }


        , hightlightSearch( text, isPre, item ){
			text = (text || '').toString();
            text = text.replace( /</g, '&lt;' ).replace( />/g, '&gt;' );

            //text = text.replace( /[\r\n]+/g, '<br />' );

            if( this.searchText && this.searchText.length > 1 ){
                let tmpSearch = this.searchText;
                tmpSearch = tmpSearch
                    .replace(/\\/g, '\\\\')
                    .replace(/\*/g, '\\*')
                    .replace(/\(/g, '\\(')
                    .replace(/\)/g, '\\)')
                    .replace(/\{/g, '\\{')
                    .replace(/\}/g, '\\}')
                    .replace(/\./g, '\\.')
                    .replace(/\+/g, '\\+')
                    .replace(/\-/g, '\\-')
                    ;
                let re = new RegExp( `(${tmpSearch})`, 'ig' );
                text = text.replace( re, '<span class="search_hl">$1</span>') 
            }
            if( isPre && item && !item.nopre ){
                text = `<pre class="search_pre">${text}</pre>`;
            }

            return text;
        }

    }
}

export default mixin;
