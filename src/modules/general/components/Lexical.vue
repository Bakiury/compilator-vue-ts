<template>
    <h5>Analizador Léxico</h5>
    <div class="container-lexical">
        <template v-if="tokens.length > 0">
            <section class="my-header">
                <div>nombre</div>
                <div>tipo</div>
                <div>código</div>
            </section>
            <div class="my-content">
                <table class="table table-striped table-hover">
                    <tbody>
                        <template v-for="(token, index) in tokens" :key="index">
                            <tr>
                                <td colspan="3" class="text-primary"><u>Línea {{ index + 1 }}</u></td>
                            </tr>
                            <tr v-for="(tk, i) in token" :key="i">
                                <td class="my-text">
                                    {{ tk.nombre }}
                                </td>
                                <td class="my-text">
                                    {{ tk.tipo }}
                                </td>
                                <td class="my-text">
                                    {{ tk.codigo }}
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
    name: 'Lexical',
    props: {
        tokens: {
            type: Object,
            required: true
        }
    },
    setup() {

        return {};
    }
});
</script>

<style lang="scss" scoped>
.container-lexical {
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
    align-items: center;
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