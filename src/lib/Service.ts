/**
 * @module @dunai/core
 */

import 'reflect-metadata';
import { GenericClassDecorator, Type } from './Common';
import { Injector } from './Injector';

export const Service = (name: string = ''): GenericClassDecorator<Type<any>> => {
    return (target: Type<any>) => {
        console.log(`@Service ${name}`);
        Injector.registerService(target);
    };
};
