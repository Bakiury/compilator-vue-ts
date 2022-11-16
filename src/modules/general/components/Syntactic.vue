<template>
    <h5>Analizador Sintáctico</h5>
    <div class="container-syntactic">
        <template v-if="codeBlock.length > 0">
            <section class="my-header">
                <div>-</div>
            </section>
            <div class="my-content">
                <table class="table table-striped table-hover">
                    <tbody>
                        <template v-for="(block, index) in codeBlock" :key="index">
                            <tr>
                                <td class="text-primary"><u>Bloque de código {{ index + 1 }}</u></td>
                            </tr>
                            <tr>
                                <td class="my-text">
                                    {{ block }}
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Syntactic',
    props: {
        codeBlock: {
            type: Array,
            required: true
        }
    },
    setup() {

        return {};
    }
});
</script>

<style lang="scss" scoped>
.container-syntactic {
    width: 350px;
    height: 400px;
    overflow: hidden;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 4px 4px 8px #213547;
}

.my-header {
    display: flex;
    padding-top: 8px;
    padding-bottom: 8px;
    justify-content: space-around;
    background-color: #213547;
    box-shadow: 0px 0px 3px #213547;
}

.my-content {
    overflow-y: auto;
    height: 90%;
}

table {
    text-align: center;
}
</style>