import { GeneralStateInterface } from './interfaces';

const state = (): GeneralStateInterface => {
    return {
        lexemes: [],
        currentValue: '',
        splitLines: [],
        splitBlocks: []
    };
};

export default state;