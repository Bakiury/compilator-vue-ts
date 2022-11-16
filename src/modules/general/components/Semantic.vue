<template>
    <h5>Analizador Semántico</h5>
    <div class="container-semantic">
        <template v-if="lineBlock.length > 0">
            <section class="my-header">
                <div>-</div>
            </section>
            <div class="my-content">
                <table class="table table-striped table-hover">
                    <tbody v-if="isSemanticVar && isSemanticIf">
                        <template v-for="(line, index) in lineBlock" :key="index">
                            <tr>
                                <td colspan="3" class="text-primary"><u>Línea {{ index + 1 }}</u></td>
                            </tr>
                            <tr v-for="(answer, i) in line" :key="i">
                                <td class="my-text">
                                    {{ answer }}
                                </td>
                            </tr>
                        </template>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="3" class="text-danger text-start">
                                Se ha encontrado un error en el analizador sintáctico
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Semantic',
    props: {
        lineBlock: {
            type: Object,
            required: true
        },
        isSemanticVar: {
            type: Boolean,
            required: true
        },
        isSemanticIf: {
            type: Boolean,
            required: true
        }
    },
    setup() {

        return {};
    }
});
</script>

<style lang="scss" scoped>
.container-semantic {
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

td {
    width: 100px !important;
}
</style>