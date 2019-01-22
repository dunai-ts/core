/**
 * @module @dunai/core
 */

import { Injector } from './Injector';

export const Application = () => (target: any): any => {
    Injector.registerService(target);

    return () => {
        const instance = Injector.resolve(target);

        return instance;
    };
};
