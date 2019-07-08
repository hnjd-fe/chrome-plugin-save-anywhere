
let devMode = localStorage.getItem( 'devMode' ) || false;

if( typeof devMode == 'string' ){
    switch( devMode ){
        case 'true': 
        case '1': 
        {
            devMode = true;
            break;
        }
        default: {
            devMode = false;
            break;
        }
    }
}

export default {
    devMode
	, updateDevMode( val, _this ){
		this.devMode = val;
		_this.$emit( this.updateDevModeEventName, val );
		localStorage.setItem( 'devMode', val );
	}
	, updateDevModeEventName: 'devModeChange' 
}
