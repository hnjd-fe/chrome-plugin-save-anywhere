
document.addEventListener('DOMContentLoaded', function () {

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
