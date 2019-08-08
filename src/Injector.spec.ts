import { describe, it } from 'mocha';
import should from 'should';
import { Inject } from './Inject';
import { Injector } from './Injector';
import { Service } from './Service';

describe('Injector service', () => {
    describe('declaration position', () => {
        it('check declaration position', () => {
            @Service()
            class Service1 {
            }

            const path1 = Reflect.getMetadata('declared_in', Service1);

            should(path1).eql(path1);
        });
    });

    describe('resolve', () => {
        it('Service inject', () => {
            @Service()
            class MyService {
            }

            const my: MyService = Injector.resolve<MyService>(MyService);

            should(my).ok();
            should(my).instanceOf(MyService);
        });

        it('Inject into some class', () => {
            class MyService {
            }

            const my: MyService = Injector.resolve<MyService>(MyService);

            should(my).ok();
            should(my).instanceOf(MyService);
        });

        it('DI on Service inject', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(public another?: AnotherService) { }
            }

            const my: MyService = Injector.resolve<MyService>(MyService);

            should(my).ok();
            should(my).instanceOf(MyService);
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
        });

        it('DI on Service inject (dependency don\'t have @Service decorator)', () => {
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(public another?: AnotherService) {
                }
            }

            const instance = Injector.resolve<MyService>(MyService);

            should(instance).instanceOf(MyService);
            should(instance.another).undefined();
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
                constructor(public another?: AnotherService) { }
            }

            const my: MyService = Injector.resolve<MyService>(MyService);

            should(my).ok();
            should(my).instanceOf(MyService);
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
            should(my.another.another2).ok();
            should(my.another.another2 instanceof Another2Service).ok();
        });

        it('DI with custom parameters', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(
                    public prop: number = 0,
                    public another?: AnotherService,
                ) { }
            }

            const my: MyService = Injector.resolve<MyService>(MyService, 1);

            should(my).ok();
            should(my).instanceOf(MyService);
            should(my).have.property('prop', 1);
            should(typeof my.prop === 'number').ok();
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
        });

        it('DI with no defined custom params', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(
                    public prop: number = 0,
                    public another?: AnotherService,
                ) { }
            }

            const instance = Injector.resolve<MyService>(MyService);

            should(instance).instanceOf(MyService);
            should(instance.prop).eql(0);
            should(instance.another).instanceOf(AnotherService);
        });

        it('DI alert for circular and undefined dependency', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(
                    public prop: number = 0,
                    public another?: AnotherService,
                    public und?: undefined,
                ) { }
            }

            should(() => Injector.resolve<MyService>(MyService, 1)).throwError(
                'Dependency has type "undefined". It\'s may be circular dependency or no provided custom parameter',
            );
        });

        it('DI with custom params and skip by null', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(
                    public another?: AnotherService,
                    public prop: number = 0,
                ) { }
            }

            const my: MyService = Injector.resolve<MyService>(
                MyService,
                null,
                1,
            );

            should(my).ok();
            should(my).instanceOf(MyService);
            should(my).have.property('prop', 1);
            should(typeof my.prop !== 'number').not.ok();
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
        });

        it('DI on Some class inject', () => {
            class AnotherService {
            }

            class MyService {
                constructor(public another?: AnotherService) { }
            }

            const my: MyService = Injector.resolve<MyService>(MyService);

            should(my).ok();
            should(my).instanceOf(MyService);
            should(my.another).not.ok();
        });

        it('resolve from instance', () => {
            class MyService {
                constructor() { }
            }

            const instance = new MyService();

            should(() => Injector.resolve<MyService>(instance as any))
                .throwError('target is not a constructor');
        });
    });

    describe('create', () => {
        it('Service inject', () => {
            @Service()
            class MyService {
            }

            const my: MyService = Injector.create<MyService>(MyService);

            should(my).ok();
            should(my).instanceOf(MyService);
        });

        it('Some class inject', () => {
            class MyService {
            }

            const my: MyService = Injector.create<MyService>(MyService);

            should(my).ok();
            should(my).instanceOf(MyService);
        });

        it('DI on Service inject', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(public another?: AnotherService) { }
            }

            const my: MyService = Injector.create<MyService>(MyService);

            should(my).ok();
            should(my).instanceOf(MyService);
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
                constructor(public another?: AnotherService) { }
            }

            const my: MyService = Injector.create<MyService>(MyService);

            should(my).ok();
            should(my).instanceOf(MyService);
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
            should(my.another.another2).ok();
            should(my.another.another2 instanceof Another2Service).ok();
        });

        it('DI with custom params', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(public prop: number = 0, public another?: AnotherService) { }
            }

            const my: MyService = Injector.create<MyService>(MyService, 1);

            should(my).ok();
            should(my).instanceOf(MyService);
            should(my).have.property('prop', 1);
            should(my.prop).type('number');
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
        });

        it('DI with custom params with default value', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(public prop: number = 0, public another?: AnotherService) { }
            }

            const my: MyService = Injector.create<MyService>(MyService);

            should(my).ok();
            should(my).instanceOf(MyService);
            should(my).have.property('prop', 0);
            should(my.prop).type('number');
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
        });

        it('DI with custom params and skip by null', () => {
            @Service()
            class AnotherService {
            }

            @Service()
            class MyService {
                constructor(
                    public another?: AnotherService,
                    public prop: number = 0,
                ) { }
            }

            const my: MyService = Injector.create<MyService>(
                MyService,
                null,
                1,
            );

            should(my).ok();
            should(my).instanceOf(MyService);
            should(my).have.property('prop', 1);
            should(typeof my.prop !== 'number').not.ok();
            should(my.another).ok();
            should(my.another instanceof AnotherService).ok();
        });

        it('DI on Some class inject', () => {
            class AnotherService {
            }

            class MyService {
                constructor(public another?: AnotherService) {}
            }

            const my: MyService = Injector.create<MyService>(MyService);

            should(my).ok();
            should(my).instanceOf(MyService);
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

        // it('decorated extends of decorated (inherit)', () => {
        //     @Service()
        //     class ParentApp {
        //         public someMethod(): boolean {
        //             return true;
        //         }
        //     }
        //
        //     @Service()
        //     class App extends ParentApp {
        //         public anotherMethod(): boolean {
        //             return true;
        //         }
        //     }
        //
        //     const parent = Injector.create<ParentApp>(ParentApp);
        //
        //     const app = Injector.create<App>(App);
        //
        //     const app_instance_of = Reflect.getMetadata('instance_of', app);
        //     const app_service_id  = Reflect.getMetadata('service_id', app);
        //
        //     const App_instance_of = Reflect.getMetadata('instance_of', App);
        //     const App_service_id  = Reflect.getMetadata('service_id', App);
        //
        //     const ParentApp_instance_of = Reflect.getMetadata('instance_of', ParentApp);
        //     const ParentApp_service_id  = Reflect.getMetadata('service_id', ParentApp);
        //
        //     const parent_instance_of = Reflect.getMetadata('instance_of', parent);
        //     const parent_service_id  = Reflect.getMetadata('service_id', parent);
        //
        //     should(app_service_id).undefined();
        //     should(app_instance_of).equal(App_service_id);
        //     should(App_service_id).ok();
        //     should(App_instance_of).undefined();
        //
        //     should(parent_service_id).undefined();
        //     should(parent_instance_of).equal(ParentApp_service_id);
        //     should(ParentApp_service_id).ok();
        //     should(ParentApp_instance_of).undefined();
        //
        //     should(app.someMethod()).ok();
        //     should(app.anotherMethod()).ok();
        // });
        it('decorated extends of decorated (replaced)', () => {
            @Service()
            class ParentApp {
                public someMethod(): boolean {
                    return false;
                }
            }

            @Service()
            class App extends ParentApp {
                public someMethod(): boolean {
                    return true;
                }
            }

            const app = new App();

            should(app.someMethod()).ok();
        });
        it('decorated extends of non decorated (inherit)', () => {
            class ParentApp {
                public someMethod(): boolean {
                    return true;
                }
            }

            @Service()
            class App extends ParentApp {
            }

            const app = new App();

            should(app.someMethod()).ok();
        });
        it('decorated extends of non decorated (replace method)', () => {
            class ParentApp {
                public someMethod(): boolean {
                    return false;
                }
            }

            @Service()
            class App extends ParentApp {
                public someMethod(): boolean {
                    return true;
                }
            }

            const app = new App();

            should(app.someMethod()).ok();
        });
    });

    describe('create with injects', () => {
        it('base', () => {
            interface IAnotherService {
                field: string
            }

            @Service()
            class FooService {
            }

            @Service()
            class MyService {
                // @ts-ignore
                constructor(public deep: number,
                            @Inject('dep1') public service: IAnotherService,
                            public foo: FooService) {}
            }

            const dep1: IAnotherService = {
                field: 'foo',
            };

            const instance = Injector.createWithInjects(MyService, {
                dep1,
            }, 0);

            should(instance).ok();
            should(instance).instanceOf(MyService);
            should(instance.service).equal(dep1);
            should(instance.deep).equal(0);
            should(instance.foo).instanceOf(FooService);
        });
        it('null', () => {
            interface IAnotherService {
                field?: string
            }

            @Service()
            class FooService {
            }

            @Service()
            class MyService {
                // @ts-ignore
                constructor(public deep: number,
                            @Inject('dep1') public service: IAnotherService = {},
                            public foo: FooService) {}
            }

            const instance = Injector.createWithInjects(MyService, null, 0);

            should(instance).ok();
            should(instance).instanceOf(MyService);
            should(instance.service).eql({});
            should(instance.deep).equal(0);
            should(instance.foo).instanceOf(FooService);
        });
    });
});
