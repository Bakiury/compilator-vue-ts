import { MutationTree } from 'vuex';
import { GeneralStateInterface } from './interfaces';

export enum GeneralMutations {
    SET_LEXEMES = 'SET_LEXEMES',
    SET_CURRENT_VALUE = 'SET_CURRENT_VALUE',
    SET_SPLIT_LINES = 'SET_SPLIT_LINES',
    SET_SPLIT_BLOCKS = 'SET_SPLIT_BLOCKS'
}

const mutation: MutationTree<GeneralStateInterface> = {
    [GeneralMutations.SET_LEXEMES](state, payload) {
        state.lexemes = payload;
    },

    [GeneralMutations.SET_CURRENT_VALUE](state, payload) {
        state.currentValue = payload;
    },

    [GeneralMutations.SET_SPLIT_LINES](state, payload) {
        state.splitLines = payload;
    },

    [GeneralMutations.SET_SPLIT_BLOCKS](state, payload) {
        state.splitBlocks = payload;
    }
};

export default mutation;