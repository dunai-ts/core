import { Type } from './Common';
import { Injector } from './Injector';

export interface IDepNode {
    id: string;
    name: string;
    //path: string;
    //class: any;
    deps: IDepNode[];
}

export class DependencyTreeService {
    protected injector: {
        services: { [key: string]: any };
    };

    constructor() {
        this.injector = Injector as any;

        this.getTreeForRootInner = this.getTreeForRootInner.bind(this);
        this.getTokenForService  = this.getTokenForService.bind(this);
    }

    public getTree(root: any): IDepNode {
        const token = Reflect.getMetadata('service_id', root);

        return this.getTreeForRootInner(token);
    }

    public getRoots(): IDepNode[] {
        const dependencies = this.getDeps();

        const services = { ...this.injector.services };

        Object.keys(services).forEach(key => {
            dependencies[key].forEach(item => delete services[item]);
        });

        return Object.keys(services).map(this.getTreeForRootInner);
    }

    public printSingleTree(tree: IDepNode): string[] {
        const list: string[] = [];

        tree.deps.forEach((dep, index, arr) => {
            const isLast = index + 1 === arr.length;
            const prefix = isLast ? '\u2514 ' : '\u251C ';
            const sub    = this.printTree(dep)
                               .map((item, subindex) => (subindex ? (isLast ? '  ' : '\u2502 ') : prefix) + item);
            list.push(...sub);
        });

        return [
            `${tree.name} (${tree.id})`,
            ...list
        ];
    }

    public printTree(tree: IDepNode | IDepNode[]): string[] {
        if (Array.isArray(tree)) {
            const list: string[] = [];
            tree.forEach(root => list.push(...this.printSingleTree(root)));
            return list;
        } else {
            return this.printSingleTree(tree);
        }
    }

    private getTokenForService(service: Type<any>): string {
        const services = this.injector.services;
        const tokens   = Object.keys(this.injector.services);
        return tokens.find(key => services[key] === service);
    }

    private getNameByToken(token: any): string {
        //return service.name;
        console.log('getNameByToken', token, this.injector.services);
        return this.injector.services[token].name;
    }

    private getDependencies(target: any): string[] {
        //const services  = this.injector.services;
        //const tokens    = Object.keys(this.injector.services);
        //const serviceID = Reflect.getMetadata('service_id', target);
        const toks = Reflect.getMetadata('design:paramtypes', target) || [];
        return toks.map(this.getTokenForService);
    }

    private getDeps(): { [key: string]: string[] } {
        const services = this.injector.services;
        const tokens   = Object.keys(this.injector.services);
        //console.log('services', services);
        //console.log(Injector['instances']);
        //console.log(tokens);
        const deps: { [key: string]: string[] } = {};
        tokens.forEach(key => {
            deps[key] = this.getDependencies(services[key]);
        });
        return deps;
    }

    private getTreeForRootInner(token: string): IDepNode {
        const allDeps = this.getDeps();
        console.log('getTreeForRootInner token', token);

        console.log(allDeps[token]);

        return {
            id  : token,
            name: this.getNameByToken(token),
            //path : null,
            //class: root,
            deps: allDeps[token].map(this.getTreeForRootInner)
        };
    }
}

export const DependencyTree = new DependencyTreeService();
