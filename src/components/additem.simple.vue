<template>
    <div class="additem-box">
        <el-row>
            <el-col :span="24">
				<el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
					<el-input 
						v-model="form.note"
						suffix-icon="el-icon-enter"
						v-focus
						@blur="onBlur"
						:placeholder="$t('inputPlaceholder')"
						type="textarea"
						autosize
						@keydown.ctrl.enter.native="onSubmit()"
					></el-input>
				</el-form>
            </el-col>
        </el-row>
    </div>
</template>

<style>

.additem-box {
	position: absolute;
	top: 0;
	width: 100%;
    background: #fff;
    z-index: 10;
}

</style>

<script>

import modifyMixin from '@src/mixin/modify.js'

export default {
    mixins: [ modifyMixin ]
	, props: [ "index", "item", "hide", 'update' ]
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
		, onSubmit() {
			console.log( this.form.note, Date.now() );
			if( !this.form.note ) {
				this.$message({
					message: this.$t( 'requireNote' ),
					type: 'warning'
				});
				return;
			}
			let json = { 
				note: this.form.note 
				, type: this.index
				, status: 0
			}

			this.addItem( json ).then( ( json )=>{
					this.$message({
						message: this.$t( 'addNoteSuccess' ),
						type: 'success'
					});
					this.onBlur( null, json );
					this.update && this.update( json, this.index, this.item  );
				}, ()=>{
					this.$message({
						message: this.$t( 'addNoteError' ),
						type: 'error'
					});
				}
			);

			return false;
		}
		, onBlur( evt, json ) {
			this.hide && this.hide( this.index, this.item, json );
		}
	}
	, mounted(){
		this.updateTotal();
	}
	, computed: {

	}
	, directives: {
		focus: {
			inserted: function (el) {
				el.querySelector('textarea').focus()
			}
		}
	}
};
</script>
