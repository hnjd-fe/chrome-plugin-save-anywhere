

document.addEventListener('DOMContentLoaded', function () {

	document.body.addEventListener( 'click', ( evt ) => {
		if( evt.path && evt.path.length ){
			for( let i = 0, j = evt.path.length; i < j; i++ ){
				
			}
		}
	});

	if( !window.delegate ) return;

	delegate( document.body, '#login', 'click', ( evt )=> {
        if( chrome && chrome.tabs  ){
            chrome.tabs.create( {
                url: 'http://btbtd.org/api/saveanywhere'
            },
            function(tab) {

            });
        }else{
            location.href = "http://btbtd.org/api/saveanywhere?from=" 
				+ encodeURIComponent( location.href.split('?')[0] ) ;
        }
	});

	delegate( document.body, '#logout', 'click', ( evt )=> {
		localStorage.removeItem( 'token' );
		localStorage.removeItem( 'md5' );
		localStorage.removeItem( 'username' );
		localStorage.removeItem( 'nickname' );
		localStorage.removeItem( 'email' );
		localStorage.removeItem( 'logintype' );
		localStorage.removeItem( 'uid' );
		
		location.reload();
	});
});
