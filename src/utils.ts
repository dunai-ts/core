/**
 * @module @dunai/core
 */

export function deepFreeze(obj: any): object {
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object')
            obj[key] = deepFreeze(obj[key]);
    }, obj);
    return Object.freeze(obj);
}
