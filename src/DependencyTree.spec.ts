import { describe, it } from 'mocha';
import should from 'should';
import { DependencyTree, IDepNode } from './DependencyTree';
import { Injector } from './Injector';
import { Service } from './Service';

const injector: {
    services: { [key: string]: any };
} = Injector as any;

describe('dependency tree', () => {
    describe('printTree', () => {
        it('print single tree (for scheme #1)', () => {
            const tree: IDepNode = {
                id  : 'ytbu9nb4hyc',
                name: 'App',
                path: 'src/app.ts:54',
                deps: [
                    {
                        id  : 'ohfdu29z1o',
                        name: 'Service1',
                        deps: [
                            {
                                id  : 'xmt8ehcjp49',
                                name: 'Service2',
                                deps: [
                                    {
                                        id  : 'x3wjnemfwkm',
                                        name: 'Service4',
                                        deps: [
                                            {
                                                id  : 'dvga9exzfu9',
                                                name: 'Service5',
                                                deps: []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id  : 'eqkdoguuhf5',
                                name: 'Service3',
                                deps: []
                            }
                        ]
                    }
                ]
            };

            should(DependencyTree.printTree(tree)).eql([
                `App (src/app.ts:54)`,
                `└ Service1`,
                `  ├ Service2`,
                `  │ └ Service4`,
                `  │   └ Service5`,
                `  └ Service3`
            ]);
        });
        it('print roots (for scheme #1)', () => {
            const roots: IDepNode[] = [
                {
                    id  : 'ytbu9nb4hyc',
                    name: 'App',
                    path: 'src/app.ts:54',
                    deps: [
                        {
                            id  : 'ohfdu29z1o',
                            name: 'Service1',
                            deps: [
                                {
                                    id  : 'xmt8ehcjp49',
                                    name: 'Service2',
                                    deps: [
                                        {
                                            id  : 'x3wjnemfwkm',
                                            name: 'Service4',
                                            deps: [
                                                {
                                                    id  : 'dvga9exzfu9',
                                                    name: 'Service5',
                                                    deps: []
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id  : 'eqkdoguuhf5',
                                    name: 'Service3',
                                    deps: []
                                }
                            ]
                        }
                    ]
                },
                {
                    id  : 'jq7cbhspyad',
                    name: 'UnusedService',
                    deps: []
                }
            ];

            should(DependencyTree.printTree(roots)).eql([
                'App (src/app.ts:54)',
                '└ Service1',
                '  ├ Service2',
                '  │ └ Service4',
                '  │   └ Service5',
                '  └ Service3',
                'UnusedService'
            ]);
        });
    });
    describe('Scheme #1', () => {
        before(() => {
            Injector.reset();
        });

        @Service()
        class UnusedService {}

        @Service()
        class Service5 {}

        @Service()
        class Service4 {constructor(_: Service5) {return;}}

        @Service()
        class Service3 {}

        @Service()
        class Service2 {constructor(_: Service4) {return;}}

        @Service()
        class Service1 {constructor(_: Service2, __: Service3) {return;}}

        @Service()
        class App {constructor(_: Service1) {return;}}

        const sApp = Reflect.getMetadata('service_id', App);
        const sid1 = Reflect.getMetadata('service_id', Service1);
        const sid2 = Reflect.getMetadata('service_id', Service2);
        const sid3 = Reflect.getMetadata('service_id', Service3);
        const sid4 = Reflect.getMetadata('service_id', Service4);
        const sid5 = Reflect.getMetadata('service_id', Service5);
        const sun  = Reflect.getMetadata('service_id', UnusedService);

        it('check list of services', () => {
            const services = injector.services;
            const tokens   = Object.keys(injector.services);

            should(tokens).length(7);
            should(services).have.properties([
                sApp,
                sid1,
                sid2,
                sid3,
                sid4,
                sid5,
                sun
            ]);
        });

        it('getTree', () => {
            const tree = DependencyTree.getTree(App);

            should(tree).containDeepOrdered({
                id  : sApp,
                name: 'App',
                deps: [
                    {
                        id  : sid1,
                        name: 'Service1',
                        deps: [
                            {
                                id  : sid2,
                                name: 'Service2',
                                deps: [
                                    {
                                        id  : sid4,
                                        name: 'Service4',
                                        deps: [
                                            {
                                                id  : sid5,
                                                name: 'Service5',
                                                deps: []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id  : sid3,
                                name: 'Service3',
                                deps: []
                            }
                        ]
                    }
                ]
            } as IDepNode);
        });

        it('getTree (print)', () => {
            const tree = DependencyTree.getTree(App);

            should(DependencyTree.printTree(tree, false)).eql([
                `App`,
                `└ Service1`,
                `  ├ Service2`,
                `  │ └ Service4`,
                `  │   └ Service5`,
                `  └ Service3`
            ]);
        });

        it('getRoots', () => {
            const tree = DependencyTree.getRoots();

            should(tree).containDeepOrdered([
                {
                    id  : sun,
                    name: 'UnusedService',
                    deps: []
                },
                {
                    id  : sApp,
                    name: 'App',
                    deps: [
                        {
                            id  : sid1,
                            name: 'Service1',
                            deps: [
                                {
                                    id  : sid2,
                                    name: 'Service2',
                                    deps: [
                                        {
                                            id  : sid4,
                                            name: 'Service4',
                                            deps: [
                                                {
                                                    id  : sid5,
                                                    name: 'Service5',
                                                    deps: []
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id  : sid3,
                                    name: 'Service3',
                                    deps: []
                                }
                            ]
                        }
                    ]
                }
            ] as IDepNode[]);
        });

        it('getRoots (print)', () => {
            const roots = DependencyTree.getRoots();

            should(DependencyTree.printTree(roots, false)).eql([
                `UnusedService`,
                `App`,
                `└ Service1`,
                `  ├ Service2`,
                `  │ └ Service4`,
                `  │   └ Service5`,
                `  └ Service3`
            ]);
        });
    });
});
