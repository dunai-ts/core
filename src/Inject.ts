/**
 * @module @dunai/core
 */

import {
    addControllerParamDecoration,
    IDecoratedParamResolveData,
} from './ParamDecoration';

export const INJECTOR_INJECT_PARAM = 'INJECTOR_INJECT_PARAM';

/**
 * Mark a class as a service
 * @decorator
 */
export function Inject(token: string): any {
    return addControllerParamDecoration({
        type       : INJECTOR_INJECT_PARAM,
        useFunction: (data: IDecoratedParamResolveData) => data ? data[token] : undefined,
    });
}
