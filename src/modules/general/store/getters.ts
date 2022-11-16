import { RootState } from '@/store/types';
import { GetterTree } from 'vuex';
import { GeneralStateInterface } from './interfaces';

const getters: GetterTree<GeneralStateInterface, RootState> = {
    getLexemes(state) {

        return state.lexemes;
    },

    getCurrentValue(state) {

        return state.currentValue;
    },

    getSplitLines(state) {

        return state.splitLines;
    },

    getSplitBlocks(state) {

        return state.splitBlocks;
    },
};

export default getters;