<template>
    <div>
        <span>数据库: {{ config.dbName  }}</span>
        , <span>数据表: {{ config.dbDataTableName }}</span>
        , <span>数据总数: {{ total }}</span>
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
