
/*

  // Create a new tab with the OAuth 2.0 prompt
  chrome.tabs.create({url: this.adapter.accessTokenURL(this.getConfig())},
  function(tab) {
    // 1. user grants permission for the application to access the OAuth 2.0
    // endpoint
    // 2. the endpoint redirects to the redirect URL.
    // 3. the extension injects a script into that redirect URL
    // 4. the injected script redirects back to oauth2.html, also passing
    // the redirect URL
    // 5. oauth2.html uses redirect URL to know what OAuth 2.0 flow to finish
    // (if there are multiple OAuth 2.0 adapters)
    // 6. Finally, the flow is finished and client code can call
     myAuth.getAccessToken() to get a valid access token.
  });

*/



document.addEventListener('DOMContentLoaded', function () {
    console.log( 'background login', Date.now() );
    /*document.querySelector('button#google').addEventListener('click', function() { authorize('google'); });
    document.querySelector('button#github').addEventListener('click', function() { authorize('github'); });
    document.querySelector('button#clear').addEventListener('click', function() { clearAuthorized() });
    checkAuthorized();*/

    let loginEle = document.querySelector('#login') 

    if( !loginEle ){
        console.log( 'login element not found!');
        return;
    }

    loginEle.addEventListener( 'click', ()=>{
        chrome.tabs.create( {
            url: 'http://btbtd.org/api/saveanywhere'
        },
        function(tab) {

        });
    });

});


