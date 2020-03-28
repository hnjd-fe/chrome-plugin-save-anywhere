import GridDataChildComp from '@src/components/griddata.child.vue';
import AddItemSimpleComp from '@src/components/additem.simple.vue';
import AddItemComp from '@src/components/additem.vue';
import EditItemComp from '@src/components/edititem.vue';
let mixin = {
    data() {
        return {
        }
    }
    , components: {
        AddItemSimpleComp
		, GridDataChildComp
        , AddItemComp
		, EditItemComp
    } 
    , methods: {
    }
}

export default mixin;
