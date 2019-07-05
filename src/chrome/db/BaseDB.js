
export default class BaseDB {
    constructor( dbType ){
        this.dbType = dbType;
    }

    init(){
        console.log( 'method from BaseDB.init' )
    }

    topList( limit = 50 ){
        return new Promise( ( resolve, reject )=>{
            setTimeout( ()=>{ resolve( [ 'topList mock', Date.now()  ] ) }, 50 )
        });
    }

    testData( limit = 10000 ){

    }
}
