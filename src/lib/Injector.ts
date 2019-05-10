/**
 * @module @dunai/core
 */

import 'reflect-metadata';
import { Type } from './Common';

export class InjectorService {
    /**
     * Map for all services
     * @type {Map<string, Type<any>>}
     */

    protected services: { [key: string]: any }  = {};
    protected instances: { [key: string]: any } = {};

    /**
     * Register service in available list
     * @param {Type<any>} service
     * @return {string}
     */
    public registerService(service: Type<any>): string {
        for (const item in this.services) {
            if (this.services[item] === service) {
                throw new Error(`${service} already registered`);
            }
        }

        try {
            const stack: string[] = (new Error()).stack.split('\n');
            const str             = stack[6].match(/\((.*)\)$/);
            const path            = str[1];

            Reflect.defineMetadata('definition_in', path, service);
        } catch (_) {
            Reflect.defineMetadata('definition_in', null, service);
        }

        let serviceID = '';
        do {
            serviceID = Math.random()
                            .toString(36)
                            .substring(2);
        } while (serviceID in this.services);

        this.services[serviceID] = service;
        Reflect.defineMetadata('service_id', serviceID, service);
        return serviceID;
    }

    /**
     * Set association for dependency and instance
     * @param {Type<any>} target
     * @params {any} instance
     */
    public set(target: Type<any>, instance: any): void {
        const serviceID = Reflect.getMetadata('service_id', target);
        if (!serviceID) throw new Error('Object is not decorated as a Service');
        this.instances[serviceID] = instance;
    }

    /**
     * Remove all instances from cache.
     *
     * Using in tests
     */
    public reset(): void {
        this.instances = {};
    }

    /**
     * Resolve instance with injection required services
     * @param {Type<any>} target
     * @returns {T}
     */
    public resolve<T>(target: Type<any>, ...params: any[]): T {
        // TODO cilcular dependency
        // TODO self dependency

        const serviceID = Reflect.getMetadata('service_id', target);

        if (serviceID in this.instances) {
            return this.instances[serviceID];
        }

        const injections = this.makeInjections(target, params);

        const instance = new target(...injections);
        if (serviceID) this.set(target, instance);

        return instance;
    }

    /**
     * Create new instance with injection required services
     * @param {Type<any>} target
     * @returns {T}
     */
    public create<T>(target: Type<any>, ...params: any[]): T {
        // TODO circular dependency
        // TODO self dependency
        this.checkForRegistered(target);

        const injections = this.makeInjections(target, params);

        const instance = new target(...injections);

        const serviceID = Reflect.getMetadata('service_id', target);
        if (serviceID)
            Reflect.defineMetadata('instance_of', serviceID, instance);

        return instance;
    }

    /**
     * Check entity for registered
     * @param target
     */
    public checkForRegistered(target: any): boolean {
        // TODO check in local list
        return Reflect.getMetadata('instance_of', target) || Reflect.getMetadata('service_id', target);
    }

    /**
     * Make injections for target
     * @param target
     * @param params custom parameters
     * @returns array of dependencies
     */
    private makeInjections(target: Type<any>, params: any[]): any[] {
        const tokens     = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map((token: any, index: number) => {
            if (token === void 0) {
                throw new Error(
                    'Dependency has type "undefined". It\'s may be circular dependency or no provided custom parameter'
                );
            }

            if (params[index] === void 0 || params[index] === null) {
                const serviceID = Reflect.getMetadata('service_id', token);
                if (!serviceID)
                    return params[index];
                //return null;
                //throw new Error(
                //    'Can not resolve dependency "' +
                //    token.name +
                //    '"\n' +
                //    'It\'s no provided custom parameter or dependency don\'t have @Service() decorator'
                //);

                if (serviceID in this.instances) {
                    return this.instances[serviceID];
                }

                return this.resolve<any>(token);
            } else {
                return params[index];
            }
        });

        return injections;
    }
}

export const Injector = new InjectorService();
