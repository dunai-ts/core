import { describe, it } from 'mocha';
import should from 'should';
import { addControllerParamDecoration, runMethod } from './ParamDecoration';

describe('Param decorations', () => {
    // tslint:disable-next-line
    function Value() {
        return addControllerParamDecoration({
            type       : 'value',
            useFunction: (data: { value: number }) => data ? data.value : null
        });
    }

    // tslint:disable-next-line
    function Increase(inc = 1) {
        return addControllerParamDecoration({
            type       : 'increase',
            useFunction: (_, value) => value + inc
        });
    }

    // tslint:disable-next-line
    function Timeout(pre = 'pre') {
        return addControllerParamDecoration({
            type       : 'timeout',
            useFunction: (_, value) => new Promise(resolve => setTimeout(() => resolve(pre + value), 100))
        });
    }

    describe('get value', () => {
        it('get value', async () => {
            class TestCtrl {
                public one(@Value() num: number): number {
                    return num;
                }
            }

            const test    = new TestCtrl();
            const promise = runMethod(test, 'one')({ value: 10 });
            should(promise.then).Function();
            const result = await promise;
            should(result).eql(10);

            const test2   = new TestCtrl();
            const result2 = await runMethod(test2, 'one')({ value: 20 });
            should(result2).eql(20);
        });
    });

    describe('default value', () => {
        it('default value 1', async () => {
            class DefaultCtrl {
                public one(req: string): string {
                    return req;
                }
            }

            const test = new DefaultCtrl();

            const result = await runMethod(test, 'one')(null);
            should(result).undefined();

            const test2   = new DefaultCtrl();
            const result2 = await runMethod(test2, 'one')(null, { value: 'req', other: 'foo' }, { another: 'bar' });
            should(result2).eql({ value: 'req', other: 'foo' });
        });

        it('default value 2', async () => {
            class TestCtrl {
                // tslint:disable-next-line
                public one(req: string, @Value() num: number) {
                    return { req, num };
                }
            }

            const test2   = new TestCtrl();
            const result2 = await runMethod(test2, 'one')({ value: 20 });
            should(result2).eql({ req: undefined, num: 20 });

            const test   = new TestCtrl();
            const result = await runMethod(test, 'one')({ value: 10 }, 'req');
            should(result).eql({ req: 'req', num: 10 });
        });
    });

    describe('base decorators', () => {
        it('base decorators', async () => {
            class TestCtrl {
                public one(@Increase() @Value() num: number): number {
                    return num;
                }

                public action(@Increase(5) @Value() num: number): number {
                    return num;
                }
            }

            const test   = new TestCtrl();
            const result = await runMethod(test, 'one')({ value: 1 });
            should(result).eql(2);

            const test2   = new TestCtrl();
            const result2 = await runMethod(test2, 'one')({ value: 2 });
            should(result2).eql(3);

            const test3   = new TestCtrl();
            const result3 = await runMethod(test3, 'action')({ value: 1 });
            should(result3).eql(6);

            const test4   = new TestCtrl();
            const result4 = await runMethod(test4, 'action')({ value: 20 });
            should(result4).eql(25);
        });

        it('bad order of decorators 2', async () => {
            class TestCtrl2 {
                public one(@Increase(5) num: number): number {
                    return num;
                }

                public action(@Value() @Increase(5) num: number): number {
                    return num;
                }
            }

            const test2   = new TestCtrl2();
            const result2 = await runMethod(test2, 'one')({ value: 15 });
            should(result2).NaN();

            const test3   = new TestCtrl2();
            const result3 = await runMethod(test3, 'action')({ value: 15 });
            should(result3).eql(15);

            const test4   = new TestCtrl2();
            const result4 = await runMethod(test4, 'action')({ value: 25 });
            should(result4).eql(25);
        });

        it('promise', async () => {
            class TestCtrl2 {
                public one(@Timeout('a') @Increase(5) num: number): number {
                    return num;
                }

                public action(@Value() @Increase(5) num: number): number {
                    return num;
                }
            }

            const test2   = new TestCtrl2();
            const result2 = await runMethod(test2, 'one')({ value: 15 });
            should(result2).eql('aNaN');

            const test3   = new TestCtrl2();
            const result3 = await runMethod(test3, 'action')({ value: 15 });
            should(result3).eql(15);

            const test4   = new TestCtrl2();
            const result4 = await runMethod(test4, 'action')({ value: 25 });
            should(result4).eql(25);
        });
    });
});
