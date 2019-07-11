
import db from '@src/chrome/db.js'

let mixin = {
    data() {
        return {
            searchDelayMs: 500
            , searchDelayName: 'searchDelay' 
            , listTotal: 0
            , listPageSize: 50 
            , listCurPage: 1 
            , listData: []
            , curPageData: []
            , searchText: ''
			, isSearch: 0
			, loading: true 
            , paddingMain: ''
            , searchTextDelay: 0

        }
    }
    , methods: {
        updateTotal() {
            this.$refs.databaseInfo.updateTotal();
        }

        , deleteItem( id ) {
            return new Promise( ( resolve, reject ) => {
                db.deleteItem( id ).then( ()=> {
                    resolve( id );
                }).catch( ()=>{
                    reject( id );
                });
            });
        }

        , updateDefaultList() {
            db.topList()
            .then( ( data )=>{
                this.listData = data;
				this.listTotal = this.listData.length;
				this.listCurPage = 1;

                this.afterUpdateList();
            });
        }
        , updateFullList( page = 1, id ) {
            db.fullList( page, 50, id )
            .then( ( data )=>{
                this.listData = data.data;
				this.listTotal = data.total;
				this.page = 1;

                this.afterUpdateList();
            });
        }

        , afterUpdateList( curListPage ){
        }

        , hightlightSearch( text, isPre, item ){
            text = text.replace( /</g, '&lt;' ).replace( />/g, '&gt;' );

            //text = text.replace( /[\r\n]+/g, '<br />' );

            if( this.searchText ){
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
                text = `<pre>${text}</pre>`;
            }

            return text;
        }

        , fixNewLine(){
        }

        , onTextInput () {
            if( this.searchTextDelay ) clearTimeout( this.searchTextDelay );

            this.searchTextDelay = setTimeout( ()=>{
				let search = (this.searchText||'').trim();
				if( !search || search.length < 2 ){
					this.isSearch = 0;
					this.updateFullList( this.listCurPage );
					return;
				}

				this.loading = true;

				db.search( this.searchText ).then( ( list )=>{
					this.isSearch = 1;
					this.searchData = list;
					this.listData = this.searchData.slice( 0, this.listPageSize );
					this.listCurPage = 1;
					this.listTotal = this.searchData.length

					this.afterUpdateList();
				});
            }, this.searchDelayMs );
        }
		, curListChange( page ) {
			this.loading = true;
			this.listCurPage = parseInt( page );

			if( this.isSearch ){
				let start = ( page - 1 ) * this.listPageSize;
				this.listData = this.searchData.slice( start, start + this.listPageSize );
			}else{
				this.updateFullList( page  );
			}
		}



    }
}

export default mixin;
