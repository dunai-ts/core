/**
 * @module @dunai/core
 */

import 'reflect-metadata';
import { GenericClassDecorator, Type } from './Common';
import { Injector } from './Injector';

export const Service = (): GenericClassDecorator<Type<any>> => {
    return (target: Type<any>) => {
        Injector.registerService(target);
    };
};
