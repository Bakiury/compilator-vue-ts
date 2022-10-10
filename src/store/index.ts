import { createStore, StoreOptions } from 'vuex';
import { RootState } from '@/store/types';

// --- store modules
import general from '@/modules/general/store';

export enum AppMutations {
    SET_INITIALIZED = 'SET_INITIALIZED',
    SET_ALLOWED = 'SET_ALLOWED'
}

const store: StoreOptions<RootState> = {
    state: {
        initialized: false,
        allowed: false,
    },
    mutations: {
        [AppMutations.SET_INITIALIZED](state, payload: boolean) {
            state.initialized = payload;
        },
        [AppMutations.SET_ALLOWED](state, payload: boolean) {
            state.allowed = payload;
        }
    },
    actions: {

    },
    modules: {
        general
    },
    getters: {

    }
};

export default createStore(store);
