
function webpackJsonp( entry, main, dep ){
    for( let key in main ){
        main[key]();
    }
}
