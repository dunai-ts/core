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

    protected services: { [key: string]: any } = {};
    protected instances: { [key: string]: any } = {};

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

        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
//        console.log('tokens', Reflect.getMetadata('design:paramtypes', target), tokens, tokens.length);
        const injections = tokens.map((token: any, index: number) => {

            if (params[index] === void 0 || params[index] === null) {
                return Injector.resolve<any>(token);
            } else {
                return params[index];
            }
        });

        const instance = new target(...injections);
        if (serviceID)
            this.set(target, instance);

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

        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map((token: any, index: number) => {
            if (params[index] === void 0 || params[index] === null)
                return Injector.resolve<any>(token);
            else
                return params[index];
        });

        const instance = new target(...injections);

        return instance;
    }

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

        let serviceID = '';
        do {
            serviceID = Math.random().toString(36).substring(2);
        }
        while (serviceID in this.services);

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
        if (!serviceID)
            throw new Error('Object is not decorated as a Service');
        this.instances[serviceID] = instance;
    }

    /**
     * Reset all instances
     */
    public reset(): void {
        this.instances = {};
    }
}

export const Injector = new InjectorService();
