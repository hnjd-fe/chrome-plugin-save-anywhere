<template>
    <div>
        <span>{{$t('databaseLabel')}} {{ config.dbName  }}</span>
        , <span>{{$t('dataTableLabel')}} {{ config.dbDataTableName }}</span>
        , <span>{{$t('totalLabel')}} {{ total }}</span>
    </div>
</template>

<style>
</style>

<script>

import config from '@src/chrome/config.js'
import db from '@src/chrome/db.js'

export default {
    data() {
        return {
            config
            , total: 0
        }
    }
    , methods: {
        updateTotal() {
            db.total().then( (total)=>{
                this.total = total
            } )
        }
    }
    , mounted(){
        this.updateTotal();
    }
    , computed: {

    }
};
</script>
