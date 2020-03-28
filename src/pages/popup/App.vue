<template>
<div id="app">
    <mainLayout :packInfo="packInfo" />
</div>
</template>

<script>

window.name = '_save_anywhere_popup';

const packInfo = require( '@root/package.json' )
import mainLayout from './mainLayout.vue'

export default {
    data(){
        return {
            packInfo: packInfo
        }
    },
    components: { mainLayout },
    methods: {
    }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
