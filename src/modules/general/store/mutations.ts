import { MutationTree } from 'vuex';
import { ModulenameStateInterface } from './interfaces';

export enum ModulenameMutations {
    SET_SOMETHING = 'SET_SOMETHING',
}

const mutation: MutationTree<ModulenameStateInterface> = {
    [ModulenameMutations.SET_SOMETHING](state, payload) {
        state.something = payload;
    }
};

export default mutation;