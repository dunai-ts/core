import { describe, it } from 'mocha';
import should from 'should';
import { Accessor } from './Accessor';

const demoData = {
    num: 123,
    obj: {
        arr  : [
            4, 3, 2, 1,
        ],
        empty: {},
        foo  : 'Bar',
        sub  : {
            k: 'l',
        },
    },
    str: 'Foo',
};

describe('Accessor', () => {
    describe('get', () => {
        it('get first level field', () => {
            const acc = new Accessor(demoData);

            should(acc.get('num')).equal(123);
        });
        it('get deep field', () => {
            const acc = new Accessor(demoData);

            should(acc.get('obj.sub')).eql(demoData.obj.sub);
            should(acc.get('obj.sub')).equal(demoData.obj.sub);
        });
        it('get unknown field with default', () => {
            const acc = new Accessor(demoData);

            should(acc.get('obj.unknown', 'defaultValue')).eql('defaultValue');
        });
    });
    describe('set', () => {
        it('set first level field', () => {
            const acc = new Accessor(demoData);

            should(acc.set('num', 234)).equal(acc);
            should(acc.get('num')).equal(234);
        });
        it('set deep field', () => {
            const acc = new Accessor(demoData);

            const obj = {
                bar: 'foo',
            };

            should(acc.set('obj.sub', obj)).eql(acc);
            should(acc.value).eql({
                ...demoData,
                obj: {
                    ...demoData.obj,
                    sub: obj,
                },
            });
            should(acc.get('obj.sub')).equal(obj);
        });
        it('set unknown deep field ', () => {
            const acc = new Accessor(demoData);

            should(acc.set('obj.unknown.index', 'num')).equal(acc);
            should(acc.get('obj.unknown.index')).equal('num');
        });
        it('set field for primitive', () => {
            const acc = new Accessor(demoData);

            should(() => acc.set('num.index', 'num')).throwError();
        });
    });
});
