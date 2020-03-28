<template>
<div id="app">
    <mainLayout :packInfo="packInfo" />
</div>
</template>

<script>

import mainLayout from './mainLayout.vue'

const packInfo = require( '@root/package.json' )
window.name = `_${packInfo.name}_popup`;

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
