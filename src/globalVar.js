
import parseBool from 'parseBoolean';

let devMode = parseBool( localStorage.getItem( 'devMode' ) );
let restoreClean = parseBool( localStorage.getItem( 'restoreClean' ) );

//restoreClean = true;

export default {
    devMode
	, updateDevMode( val, _this ){
		this.devMode = val;
		_this.$emit( this.updateDevModeEventName, val );
		localStorage.setItem( 'devMode', val );
	}
	, updateDevModeEventName: 'devModeChange' 

    , restoreClean
	, updateRestoreClean( val, _this ){
		this.restoreClean = val;
		localStorage.setItem( 'restoreClean', val );
	}
}
