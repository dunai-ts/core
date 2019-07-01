/**
 * @module @dunai/core
 */

import 'reflect-metadata';
import { GenericClassDecorator, Type } from './Common';
import { Injector } from './Injector';

/**
 * Mark a class as a service
 * @decorator
 */
export function Service(): GenericClassDecorator<Type<any>> {
    return (target: Type<any>) => {
        Injector.registerService(target);
    };
}
