import { Module } from 'vuex';
import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import { GeneralStateInterface } from './interfaces';
import { RootState } from '@/store/types';

const General: Module<GeneralStateInterface, RootState> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state
};

export default General;