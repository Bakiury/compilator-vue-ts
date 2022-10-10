import { RootState } from '@/store/types';
import { GetterTree } from 'vuex';
import { ModulenameStateInterface } from './interfaces';

const getters: GetterTree<ModulenameStateInterface, RootState> = {
    getSomething(state) {

        return state.something;
    }
};

export default getters;