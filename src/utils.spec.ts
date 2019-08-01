import { describe, it } from 'mocha';
import should from 'should';
import { deepCopy, deepFreeze, getField } from './utils';

describe('utils', () => {
    describe('deepFreeze', () => {
        it('eql', () => {
            const obj = {
                foo: 'bar',
            };
            const ret = deepFreeze(obj);

            should(ret).equal(obj);
        });
    });
    describe('deepCopy', () => {
        it('eql', () => {
            const obj = {
                arr : [
                    4, 3, 2, 1,
                ],
                foo : 'bar',
                null: null as any,
                sub : {
                    k: 'l',
                },
            };
            const ret = deepCopy(obj);

            should(ret).eql(obj);
            should(ret).not.equal(obj);
            ret.sub.k = 'j';
            should(ret).not.eql(obj);
        });
    });
    describe('getField', () => {
        const obj = {
            foo: 'bar',
            sub: {
                k: 'l',
            },
        };
        it('""', () => {
            should(
                getField(obj, ''),
            ).equal(
                obj,
            );
        });
        it('foo', () => {
            should(
                getField(obj, 'foo'),
            ).equal(
                'bar',
            );
        });
        it('sub', () => {
            should(
                getField(obj, 'sub'),
            ).equal(
                obj.sub,
            );
        });
        it('sub.k', () => {
            should(
                getField(obj, 'sub.k'),
            ).equal(
                'l',
            );
        });
        it('null', () => {
            should(
                getField(obj, 'null'),
            ).equal(
                null,
            );
        });
        it('unknown', () => {
            should(
                getField(obj, 'unknown'),
            ).equal(
                null,
            );
        });
        it('bad.unknown', () => {
            should(
                getField(obj, 'bad.unknown'),
            ).equal(
                null,
            );
        });
        it('unknown with default', () => {
            should(
                getField(obj, 'unknown', 'defValue'),
            ).equal(
                'defValue',
            );
        });
        it('bad.unknown', () => {
            should(
                getField(obj, 'bad.unknown', 'defValue'),
            ).equal(
                'defValue',
            );
        });
    });
});
