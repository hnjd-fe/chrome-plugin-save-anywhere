
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
            , syncInProcessing: 0
            , fullTotal: 0

            , token: localStorage.getItem( 'token' )
            , email: localStorage.getItem( 'email' )
            , username: localStorage.getItem( 'username' )
            , nickname: localStorage.getItem( 'nickname' ) || localStorage.getItem( 'username' )
            , md5: localStorage.getItem( 'md5' )
            , logintype: localStorage.getItem( 'logintype' )
            , uid: localStorage.getItem( 'uid' )
        }
    }
    , methods: {
        synchronousData() {
            console.log( 'synchronousData', Date.now(), db.isLogin() );

            this.syncInProcessing = 1;
            if( db.isLogin() ){
                db.sync().then( ()=>{
                });
            }
        }
        , initLogin() {
            this.setDataItem( 'token' );
            this.setDataItem( 'username' );
            this.setDataItem( 'nickname' );
            this.setDataItem( 'email' );
            this.setDataItem( 'md5' );
            this.setDataItem( 'logintype' );
            this.setDataItem( 'uid' );

            if( this.$route.query.token ){
                setTimeout( ()=>{
                    location.href = location.href.split( '?' )[0];
                }, 50 );
            }
        }
        , setDataItem( key, val ){
            if( this.$route.query[key]){
                localStorage.setItem( key, this.$route.query[key]);
                this.$set( this.data || {}, key, val );
            }
        }

        , updateTotal() {
            this.$refs.databaseInfo.updateTotal();
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

        , updateDefaultList() {
            db.topList()
            .then( ( data )=>{
                this.listData = data;
				this.listTotal = this.listData.length;
				this.listCurPage = 1;

                this.afterUpdateList();
                this.updateFullTotal();
            });
        }
        , updateFullList( page = 1, id ) {
            db.fullList( page, 50, id )
            .then( ( data )=>{
                this.listData = data.data;
				this.listTotal = data.total;
				this.page = 1;

                this.afterUpdateList();
                this.updateFullTotal();
            });
        }

        , afterUpdateList( curListPage ){
        }

        , updateFullTotal(){
            db.total().then( ( total ) => {
                this.fullTotal = total;
            });
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
                    this.updateFullTotal();
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
