import { Module } from 'vuex';
import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import { ModulenameStateInterface } from './interfaces';
import { RootState } from '@/store/types';

const Modulename: Module<ModulenameStateInterface, RootState> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state
};

export default Modulename;