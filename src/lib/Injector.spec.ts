import { describe, it } from 'mocha';
import should from 'should';
import { Injector } from './Injector';
import { Service } from './Service';

describe('Injector service', () => {
    describe('resolve', () => {
        it('Service inject', () => {
            @Service()
            class MyService {

            }

            const my: MyService = Injector.resolve<MyService>(MyService);

            should(my).ok();
            should(my instanceof MyService).ok();
        });

        it('Some class inject', () => {
            class MyService {

            }

            const my: MyService = Injector.resolve<MyService>(MyService);

            should(my).ok();
            should(my instanceof MyService).ok();
        });

        it('DI on Service inject', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(public another?: AnotherService) {
                    console.log(another);
                }
            }

            const my: MyService = Injector.resolve<MyService>(MyService);

            should(my).ok();
            should(my instanceof MyService).ok();
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
        });

        it('Nested DI on Service inject', () => {
            @Service()
            class Another2Service {
            }

            @Service()
            class AnotherService {
                constructor(public another2?: Another2Service) {}
            }

            @Service()
            class MyService {
                constructor(public another?: AnotherService) {
                    console.log(another);
                }
            }

            const my: MyService = Injector.resolve<MyService>(MyService);

            should(my).ok();
            should(my instanceof MyService).ok();
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
            should(my.another.another2).ok();
            should(my.another.another2 instanceof Another2Service).ok();
        });

        // it('DI with custom params', () => {
        //     @Service()
        //     class AnotherService {
        //     }
        //
        //     @Service()
        //     class MyService {
        //         constructor(public prop: number = 0, public another?: AnotherService) {
        //             console.log(prop, another);
        //         }
        //     }
        //
        //     const my: MyService = Injector.resolve<MyService>(MyService, 1);
        //
        //     should(my).ok();
        //     should(my instanceof MyService).ok();
        //     should(my).have.property('prop', 1);
        //     should(typeof my.prop !== 'number').ok();
        //     should(my.another).ok();
        //     should(my.another instanceof AnotherService).ok();
        // });

        it('DI with custom params and skip by null', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(public another?: AnotherService, public prop: number = 0) {
                    console.log(prop, another);
                }
            }

            const my: MyService = Injector.resolve<MyService>(MyService, null, 1);

            should(my).ok();
            should(my instanceof MyService).ok();
            should(my).have.property('prop', 1);
            should(typeof my.prop !== 'number').not.ok();
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
        });

        it('DI on Some class inject', () => {
            class AnotherService {
            }

            class MyService {
                constructor(public another?: AnotherService) {
                    console.log(another);
                }
            }

            const my: MyService = Injector.resolve<MyService>(MyService);

            should(my).ok();
            should(my instanceof MyService).ok();
            should(my.another).not.ok();
        });

        // it('inject undefined dependency', () => {
        //     type AnotherService = undefined;
        //
        //     class MyService {
        //         constructor(public another?: AnotherService) {
        //             console.log(another);
        //         }
        //     }
        //
        //     let my: MyService;
        //     try {
        //         my = Injector.resolve<MyService>(MyService);
        //     } catch (e) {
        //         throw e;
        //     }
        //     console.log(my);
        //     should(my).not.ok();
        // });
    });

    describe('create', () => {
        it('Service inject', () => {
            @Service()
            class MyService {

            }

            const my: MyService = Injector.create<MyService>(MyService);

            should(my).ok();
            should(my instanceof MyService).ok();
        });

        it('Some class inject', () => {
            class MyService {

            }

            const my: MyService = Injector.create<MyService>(MyService);

            should(my).ok();
            should(my instanceof MyService).ok();
        });

        it('DI on Service inject', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(public another?: AnotherService) {
                    console.log(another);
                }
            }

            const my: MyService = Injector.create<MyService>(MyService);

            should(my).ok();
            should(my instanceof MyService).ok();
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
        });

        it('Nested DI on Service inject', () => {
            @Service()
            class Another2Service {
            }

            @Service()
            class AnotherService {
                constructor(public another2?: Another2Service) {}
            }

            @Service()
            class MyService {
                constructor(public another?: AnotherService) {
                    console.log(another);
                }
            }

            const my: MyService = Injector.create<MyService>(MyService);

            should(my).ok();
            should(my instanceof MyService).ok();
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
            should(my.another.another2).ok();
            should(my.another.another2 instanceof Another2Service).ok();
        });

        // it('DI with custom params', () => {
        //     @Service()
        //     class AnotherService {
        //     }
        //
        //     @Service()
        //     class MyService {
        //         constructor(public prop: number = 0, public another?: AnotherService) {
        //             console.log(prop, another);
        //         }
        //     }
        //
        //     const my: MyService = Injector.create<MyService>(MyService, 1);
        //
        //     should(my).ok();
        //     should(my instanceof MyService).ok();
        //     should(my).have.property('prop', 1);
        //     should(typeof my.prop !== 'number').ok();
        //     should(my.another).ok();
        //     should(my.another instanceof AnotherService).ok();
        // });

        it('DI with custom params and skip by null', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(public another?: AnotherService, public prop: number = 0) {
                    console.log(prop, another);
                }
            }

            const my: MyService = Injector.create<MyService>(MyService, null, 1);

            should(my).ok();
            should(my instanceof MyService).ok();
            should(my).have.property('prop', 1);
            should(typeof my.prop !== 'number').not.ok();
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
        });

        it('DI on Some class inject', () => {
            class AnotherService {
            }

            class MyService {
                constructor(public another?: AnotherService) {
                    console.log(another);
                }
            }

            const my: MyService = Injector.create<MyService>(MyService);

            should(my).ok();
            should(my instanceof MyService).ok();
            should(my.another).not.ok();
        });

        // it('inject undefined dependency', () => {
        //     type AnotherService = undefined;
        //
        //     class MyService {
        //         constructor(public another?: AnotherService) {
        //             console.log(another);
        //         }
        //     }
        //
        //     let my: MyService = null;
        //     try {
        //         my = Injector.create<MyService>(MyService);
        //     } catch (e) {
        //         throw e;
        //     }
        //     console.log(my);
        //     should(my).not.ok();
        // });
    });
});
