<template>
    <div class="listitem-box" >
        <el-row v-for="(sitem, sindex) in list" :key="sindex">
            <!--<label>-->
                <el-col :span="1" style="text-align: center;" >
                    <el-checkbox 
                        v-model="sitem.status"
                        true-label="" 
                        false-label="" 
                        round 
                        @change.self="onChange( $event, sitem, sindex, this )"
                        />
                </el-col>
                <el-col :span="17" :xl="17" :lg="16" :md="12" style="word-break: break-all;">
                    <span v-html="hightlightSearch(sitem.note, 1, sitem)"></span>
                </el-col>
                <el-col :span="6" :xl="6" :lg="7" :md="11" style="text-align: right; padding-right: 5px; white-space: nowrap;">
                {{moment(parseInt(sitem.updateDate)).format('YYYY-MM-DD HH:mm:ss')}}
                <el-button  icon="el-icon-edit" circle style="zoom:.7"
                    @click="onEdit( $event, sitem, sindex )"
                ></el-button>
                </el-col>
            <!--</label>-->
        </el-row>
    </div>
</template>

<style>

.listitem-box {
    height: 100%;
    overflow: auto;
    > .el-row {
        line-height: 40px;
        font-size: 14px;
        border-bottom: 1px dashed #ccc;

        > .el-col {
        }
    }
}

</style>

<script>

import modifyMixin from '@src/mixin/modify.js'

export default {
    mixins: [ modifyMixin ]
	, props: [ "index", "item", "list", "edit", "update", "searchText" ]
	, watch: {
		list: function( newv, oldv ){
			if( newv ) {
			}else{
			}
		}
	}
	, data() {
		return {
			form: {
				note: ''
			}
		}
	}
	, methods: {
		updateTotal() {
		}
		, setStatus( status ){
            return status ? true : false;
		}
		, onSubmit() {
			return false;
		}
		, onBlur() {
			this.hide && this.hide( this.index, this.item );
		}
        , onEdit( evt, sitem, sindex ){
            console.log( 'onEdit', Date.now(), sitem );
            this.edit && this.edit( this.index, sitem, sindex )
        }
        , onChange( evt, sitem, sindex, src ){
            this.updateItem( sitem.id, sitem ).then( ()=>{
				this.update && this.update();
			});
        }
	}
	, mounted(){
	}
	, computed: {

	}
	, directives: {
		focus: {
			inserted: function (el) {
				el.querySelector('input').focus()
			}
		}
	}
};
</script>
