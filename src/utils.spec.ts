import { describe, it } from 'mocha';
import should from 'should';
import { deepFreeze } from './utils';

describe('utils', () => {
    describe('freeze', () => {
        it('eql', () => {
            const obj = {
                foo: 'bar'
            };
            const ret = deepFreeze(obj);

            should(ret).equal(obj);
        });
    });
});
