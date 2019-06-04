/**
 * @module @dunai/server
 */

import 'reflect-metadata';
import { Type } from './Common';

const CONTROLLER_META_KEY = 'dunai:controller';

export type IDecoratedParamResolveData = any;

export type IDecoratedParamResolveFunction = (data: IDecoratedParamResolveData, value?: any) => any;

export interface IDecoratedParamDecoration {
    type: string;
    useFunction?: IDecoratedParamResolveFunction;
    useClass?: IDecoratedParamResolver;
}

export interface IDecoratedParamResolver {
    resolveParam: IDecoratedParamResolveFunction;
}

/**
 * Base function for param decorators
 * @private
 * @param type
 * @param key
 */
// tslint:disable-next-line
export function addControllerParamDecoration(decoration: IDecoratedParamDecoration) {
    return (controller: Type<any>, propertyKey: string, index: number) => {
        const meta = getControllerMetadata(controller);

        if (!meta.methodParams[propertyKey])
            meta.methodParams[propertyKey] = [];

        if (!meta.methodParams[propertyKey][index])
            meta.methodParams[propertyKey][index] = [];

        meta.methodParams[propertyKey][index].push(decoration);
    };
}

export function prepareAllMethods(controller: Type<any>): string[] {
    return Object.keys(controller).filter(method => prepareMethod(controller, method));
}

export function prepareMethod(controller: any, method: string): IDecoratedParamResolveFunction[][] {
    const meta = getControllerMetadata(controller);
    if (meta.preparedMethods) {
        if (meta.preparedMethods[method])
            return meta.preparedMethods[method];
    } else
        meta.preparedMethods = {};

    if (!meta.methodParams[method]) {
        if (typeof controller[method] !== 'function')
            throw new Error(`Cannot prepare controller method "${method}" for ${controller.name || controller} controller`);

        meta.preparedMethods[method] = [];
        return [];
    }

    meta.preparedMethods[method] = meta.methodParams[method].map(param => {
        return param.map(item => {
            return item.useFunction;
        });
    });

    return meta.preparedMethods[method];
}


// tslint:disable-next-line
export function runMethod<T>(controller: any, method: string) {
    const params = prepareMethod(controller, method);

    return (data: IDecoratedParamResolveData, ...rest: any[]): Promise<T> => {
        while (rest.length > params.length)
            params.push([]);
        const values = [];
        for (let index = 0; index < params.length; index++) {
            const items = params[index] || [];
            values.push(
                items.reduce(
                    (value, func) => value.then(val => func(data, val)),
                    new Promise(resolve => resolve(rest[index]))
                )
            );
        }

        return Promise.all(values)
                      .then(
                          resolved => controller[method](...resolved)
                      );
    };
}

/**
 * Check controller for hidden parameters
 *
 * If parameter not exists - make it
 * @private
 * @param target
 */
export function getControllerMetadata(target: any): IControllerMeta {
    const proto = target;
    if (Reflect.hasMetadata(CONTROLLER_META_KEY, proto)) {
        return Reflect.getMetadata(CONTROLLER_META_KEY, proto) as IControllerMeta;
    } else {
        const meta: IControllerMeta = {
            methodParams   : {},
            preparedMethods: null
        };
        Reflect.defineMetadata(CONTROLLER_META_KEY, meta, proto);
        return meta;
    }
}

/**
 * Controller metadata
 * @private
 */
export interface IControllerMeta {
    methodParams: { [key: string]: IDecoratedParamDecoration[][] };
    preparedMethods: { [key: string]: IDecoratedParamResolveFunction[][] }
}
