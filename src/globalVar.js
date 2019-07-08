
import parseBool from 'parseBoolean';

let devMode = parseBool( localStorage.getItem( 'devMode' ) );

export default {
    devMode
	, updateDevMode( val, _this ){
		this.devMode = val;
		_this.$emit( this.updateDevModeEventName, val );
		localStorage.setItem( 'devMode', val );
	}
	, updateDevModeEventName: 'devModeChange' 
}
