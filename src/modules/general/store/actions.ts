import { RootState } from '@/store/types';
import { ActionTree } from 'vuex';
import { GeneralStateInterface } from './interfaces';
import { GeneralMutations } from './mutations';
import { lexemes } from '@/modules/general/mocks/lexemes';

const actions: ActionTree<GeneralStateInterface, RootState> = {
    async getLexemes({ commit }) {
        commit(`general/${ GeneralMutations.SET_LEXEMES }`, lexemes, { root: true });

        return lexemes;
    },
};

export default actions;