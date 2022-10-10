import { RootState } from '@/store/types';
import { ActionTree } from 'vuex';
import { ModulenameStateInterface } from './interfaces';
import { ModulenameMutations } from './mutations';

const actions: ActionTree<ModulenameStateInterface, RootState> = {
    async getSomething({ commit }) {
        //
    },
};

export default actions;