<template>
    <div class="container-main">
        <h1 class="bg-dark pb-3">Compilador en Vue 3 + TS</h1>
        <div v-if="showAlert" class="alert alert-warning" role="alert">
            <i class="fa-solid fa-triangle-exclamation"></i> Favor ingresar el código a evaluar
        </div>
        <div class="main">
            <section>
                <h5>Código a evaluar</h5>
                <form>
                    <textarea class="my-text mb-2" placeholder="Prueba algo como const myVar = 12;" v-model="txtArea"
                        cols="30" rows="10">
                    </textarea>
                    <div class="d-flex justify-content-center">
                        <button type="button" @click="compile" class="btn btn-dark mx-1">
                            <i class="fa-solid fa-gear"></i> Compilar
                        </button>
                        <button type="button" @click="reset" class="btn btn-primary mx-1">
                            <i class="fa-solid fa-arrows-rotate"></i> Limpiar
                        </button>
                    </div>
                </form>
            </section>
            <section>
                <div v-if="loading" class="my-fa fa-3x">
                    <i class="fa-solid fa-cog fa-spin"></i>
                </div>
                <Lexical v-else :tokens="tokens" />
            </section>
            <section>
                <div v-if="loading2" class="my-fa fa-3x">
                    <i class="fa-solid fa-cog fa-spin"></i>
                </div>
                <Syntactic v-else :codeBlock="answersByCode" />
            </section>
            <section>
                <div v-if="loading3" class="my-fa fa-3x">
                    <i class="fa-solid fa-cog fa-spin"></i>
                </div>
                <Semantic v-else :lineBlock="answersByLine" :isSemanticVar="goSemanticVar"
                    :isSemanticIf="goSemanticIf" />
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { GeneralMutations } from '../store/mutations';
import { Lexeme } from '../store/interfaces';
import Lexical from '../components/Lexical.vue';
import Syntactic from '../components/Syntactic.vue';
import Semantic from '../components/Semantic.vue';

export default defineComponent({
    components: {
        Lexical,
        Syntactic,
        Semantic
    },
    setup() {
        // --- Variables
        const store = useStore();
        const loading = ref(false);
        const loading2 = ref(false);
        const loading3 = ref(false);
        const showAlert = ref(false);
        const goSemanticVar = ref(true);
        const goSemanticIf = ref(true);
        const tokens = ref<Array<object>>([]);
        const answersByCode = ref<Array<string>>([]);
        const answers = ref<Array<string>>([]);
        const answersByLine = ref<Array<Array<string>>>([]);
        const txtArea = ref();

        // --- Functions
        const lexemes = computed(() => store.getters['general/getLexemes']);
        const currentValue = computed(() => store.getters['general/getCurrentValue']);
        const mySplitLines = computed(() => store.getters['general/getSplitLines']);
        const mySplitBlocks = computed(() => store.getters['general/getSplitBlocks']);

        const getLexemes = () => {
            store.dispatch('general/getLexemes');
        };
        const getCurrentValue = () => {
            store.commit(`general/${ GeneralMutations.SET_CURRENT_VALUE }`, txtArea.value, { root: true });
        };
        const getSplitLines = (data: Array<string>) => {
            store.commit(`general/${ GeneralMutations.SET_SPLIT_LINES }`, data, { root: true });
        };
        const getSplitBlocks = (data: Array<string>) => {
            store.commit(`general/${ GeneralMutations.SET_SPLIT_BLOCKS }`, data, { root: true });
        };

        // Compare words not found
        const checkWordNotFound = (name: string) => {
            let temp;
            // Check if the word is a number
            if (name.match(/^\d+$/g)) {
                temp = {
                    nombre: name,
                    tipo: "numero",
                    codigo: "102",
                    semantico: "Valor"
                };
                // Check if the word isn't an empty string and a number
            } else if ((name !== '' && isNaN(parseInt(name))) || name.match(/([1-9]|\w)+/g)) {
                temp = {
                    nombre: name,
                    tipo: "identificador",
                    codigo: "101",
                    semantico: "Declaración de variable"
                };
                // Check if the word isn't an empty string and if the word is a number
            } else if (name !== '' && !isNaN(parseInt(name))) {
                temp = {
                    nombre: name,
                    tipo: "numero",
                    codigo: "102",
                    semantico: ""
                };
            }
            return temp;
        };

        // Search word in lexemes
        const search = (words: Array<string>) => {
            let subTokens: Array<Lexeme | undefined> = [];

            words.forEach((tk: string) => {
                // Check if the word is inside of lexemes
                lexemes.value.some((item: Lexeme) => item.nombre == tk)
                    ? lexemes.value.filter((item: Lexeme) => {
                        if (item.nombre == tk) {
                            subTokens.push(item);
                        }
                    })

                    // Check if the word isn't an empty string
                    : checkWordNotFound(tk) !== undefined
                        ? subTokens.push(checkWordNotFound(tk))
                        : '';
            });
            tokens.value.push(subTokens);
        };

        // Divide the text in lines
        const splitLines = () => {
            const res = currentValue.value.split(/\n/g);
            getSplitLines(res);

            return res;
        }

        // Divide the text in words and then search in the lexemas db
        const splitWords = () => {
            // Loop each line
            mySplitLines.value.forEach((line: string) => {
                // In each line we separate the symmbols
                line = line.replace(/(;|=|\+|\.|\(|\)|\/|\*|{|}|'|")/g, ' $& ');

                // Separate each line by its spaces
                const res = line.split(/\s/g);

                // Search for each word
                search(res);
            });
        };

        // Split the text into blocks of code and clean all "\n"
        const splitBlocks = () => {
            const res = currentValue.value.replace(/\n/g, '').split(';');
            res.pop(); // Removes the last element, which is empty
            getSplitBlocks(res);

            return res;
        }

        // Separete cases
        const checkCase = () => {
            let ifValidation: Array<string> = [];
            let myVars: Array<string> = [];
            let myValueVars: Array<string | number> = [];
            let objVars: any = {};
            let c = 0;

            mySplitBlocks.value.forEach((line: string) => {
                // Validate variables
                line = line.trim();
                if (line.match(/^(const|let|var)\s+[A-Za-z0-9]+\s*=\s*".+"/g)) { // Catch string 1
                    answersByCode.value.push('Compila correctamente la declaración de variable tipo string');

                    let newLine = line.match(/(const|let|var)\s+[A-Za-z0-9]+\s*=\s*".+"/g)?.toString().split('=');

                    if (newLine) {
                        myVars.push(newLine[0].replace(/(var|let|const)/g, '').trim());
                        myValueVars.push(newLine[1].replace(/(var|let|const)/g, '').replace(/"/g, '').trim());
                    }
                } else if (line.match(/^(const|let|var)\s+[A-Za-z0-9]+\s*=\s*\d+/g)) { // Catch integer 1
                    answersByCode.value.push('Compila correctamente la declaración de variable tipo integer');

                    let newLine = line.match(/(const|let|var)\s+[A-Za-z0-9]+\s*=\s*\d+/g)?.toString().split('=');

                    if (newLine) {
                        myVars.push(newLine[0].replace(/(var|let|const)/g, '').trim());
                        myValueVars.push(parseInt(newLine[1].replace(/(var|let|const)/g, '').trim()));
                    }
                } else if (line.match(/^[A-Za-z0-9]+\s*=\s*".+"/g)) { // Catch string 2
                    answersByCode.value.push('Se inicializó correctamente la variable tipo string');

                    let newLine = line.match(/[A-Za-z0-9]+\s*=\s*".+"/g)?.toString().split('=');

                    if (newLine) {
                        myVars.push(newLine[0].trim());
                        myValueVars.push(newLine[1].replace(/"/g, '').trim());
                    }
                } else if (line.match(/^[A-Za-z0-9]+\s*=\s*\d+/g)) { // Catch integer 2
                    answersByCode.value.push('Se inicializó correctamente la variable tipo integer');

                    let newLine = line.match(/[A-Za-z0-9]+\s*=\s*\d+/g)?.toString().split('=');

                    if (newLine) {
                        myVars.push(newLine[0].trim());
                        myValueVars.push(parseInt(newLine[1].trim()));
                    }
                } else if (line.match(/^if\s*\(\s*[A-Za-z0-9]+\s*(===|==|!==|!=|<|>|<=|>=)\s*[A-Za-z0-9]+\s*\)\s*{\s*(.*|\s*)*}/g)) {
                    answersByCode.value.push('Compila correctamente el if');

                    ifValidation = line.replace(/\s+/g, '').split('(')[1].split(')')[0].split(/(===|==|!==|!=|<|>|<=|>=)/g);
                } else {
                    answersByCode.value.push('No se reconoce esta sintaxis');

                    goSemanticVar.value = false;
                }
            });

            if (myVars.length > 0) {
                for (let i = 0; i < myVars.length; i++) {
                    objVars[myVars[i]] = myValueVars[i];
                }
            }
            ifValidation.forEach(ifVar => {
                if (myVars.includes(ifVar)) {
                    c++;
                }
            });

            let answerIndex = answersByCode.value.indexOf('Compila correctamente el if');
            if (c > 1) {
                // console.log('Sí existen las variables')
                if (typeof (objVars[ifValidation[0]]) == typeof (objVars[ifValidation[2]])) {
                    // console.log('El tipo de dato concuerda');
                } else {
                    // console.log('El tipo de dato no concuerda');
                    if (answerIndex !== -1) {
                        answersByCode.value[answerIndex] = 'El bloque del if es incorrecto';
                        goSemanticIf.value = false;
                    }
                }
            } else {
                if (answerIndex !== -1) {
                    answersByCode.value[answerIndex] = 'El bloque del if es incorrecto';
                    goSemanticIf.value = false;
                }
            }
        };

        // Semantic answer
        const semanticAnswer = () => {
            tokens.value.forEach((line: any) => {
                line.forEach((word: Lexeme) => {
                    answers.value.push(word.semantico);
                });
                answersByLine.value.push(answers.value);
                answers.value = [];
            });
        };

        const removeAndAddSemicolon = () => {
            const lines = currentValue.value.split('\n');
            let inIf = false;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('if')) {
                    inIf = true;
                }
                if (inIf) {
                    lines[i] = lines[i].replaceAll(';', '');
                }
                if (lines[i].includes('}')) {
                    inIf = false;
                    if (!lines[i].endsWith(';')) {
                        lines[i] += ';';
                    }
                }
            }
            txtArea.value = lines.join('\n');
        }

        const reset = () => {
            txtArea.value = ``;
            tokens.value = [];
            answersByCode.value = [];
            answers.value = [];
            answersByLine.value = [];
        };

        const superLoading = () => {
            loading.value = true;
            loading2.value = true;
            loading3.value = true;
            setTimeout(() => {
                loading.value = false;
            }, 400);
            setTimeout(() => {
                loading2.value = false;
            }, 800);
            setTimeout(() => {
                loading3.value = false;
            }, 1200);
        };

        const compile = () => {
            tokens.value = [];
            answersByCode.value = [];
            answers.value = [];
            answersByLine.value = [];
            goSemanticVar.value = true;
            goSemanticIf.value = true;

            // Resolve 2 bugs
            // 1. Semicolon inside the if
            // 2. Validate in case it doesn't have a semicolon at the end of the if conditional
            removeAndAddSemicolon();

            getCurrentValue();

            if (currentValue.value) {
                if (currentValue.value.trim()) {
                    superLoading();

                    splitLines();
                    splitWords();
                    splitBlocks();
                    checkCase();
                    semanticAnswer();
                }
            } else {
                showAlert.value = true;
                setTimeout(() => {
                    showAlert.value = false;
                }, 1500);
            }
        };

        watch(txtArea, () => {
            getCurrentValue();
        });

        // --- Initialize function
        onMounted(() => {
            getLexemes();
        });

        return {
            loading, loading2, loading3, showAlert, lexemes,
            currentValue, txtArea, tokens, answersByCode, answersByLine,
            goSemanticVar, goSemanticIf, compile, reset
        };
    }
});
</script>

<style lang="scss" scoped>
.my-fa {
    width: 350px;
    height: 432px;
    display: flex;
    justify-content: center;
    align-items: center;

    .fa-solid {
        color: #213547;
        text-shadow: 0px 0px 5px #ffffff;
    }
}

.alert {
    text-align: center;
    font-size: 20px;
}

.container-main {
    background: #42b883;
    background: -webkit-linear-gradient(to top, #213547, #42b883);
    background: linear-gradient(to top, #213547, #42b883);
    min-height: 100vh;
    color: #ffffff;
    padding-bottom: 100px;

    h1 {
        text-shadow: 2px 2px 5px #000000;
        text-align: center;
        padding-top: 20px;
        box-shadow: 0px 0px 10px #213547;
    }

    .main {
        display: flex;
        justify-content: space-around;
        margin-top: 50px;
        flex-wrap: wrap;

        section {
            margin-bottom: 75px;

            textarea {
                border-radius: 10px;
                padding: 10px;
                box-shadow: 0px 0px 10px #213547;
                resize: none;
                outline: none;
            }
        }
    }
}
</style>