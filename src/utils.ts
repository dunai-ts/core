/**
 * @module @dunai/core
 */

export function deepFreeze<T>(obj: T): T {
    Object.keys(obj).forEach((key) => {
        // @ts-ignore
        if (typeof obj[key] === 'object')
        // @ts-ignore
            deepFreeze(obj[key]);
    }, obj);
    return Object.freeze(obj);
}

export function deepCopy<T>(obj: T): T {
    if (isPrimitive(obj))
        return obj;

    const result = { ...obj };
    Object.keys(obj).forEach((key) => {
        // @ts-ignore
        if (typeof obj[key] === 'object')
        // @ts-ignore
            if (Array.isArray(obj[key]))
            // @ts-ignore
                result[key] = obj[key].map(deepCopy);
            else
            // @ts-ignore
                result[key] = deepCopy(obj[key]);
    });
    return result;
}

// @ts-ignore
export function getField(obj: any, key: string | string[], defaultValue?: any): any {
    if (!key)
        return mayDefault(obj, defaultValue);

    if (typeof key === 'string' && key in obj)
        return mayDefault(obj[key], defaultValue);

    const path = typeof key === 'string' ? key.split('.') : key;

    if (!obj)
        return mayDefault(null, defaultValue);

    if (path.length === 1)
        return mayDefault(obj[path[0]], defaultValue);

    return getField(obj[path.shift()], path, defaultValue);
}

export function setField<T>(target: T, key: string | string[], value: any): T {
    const path: string[] = typeof key === 'string'
        ? key.split('.')
        : key;

    const obj: any = target;

    if (!path.length)
        throw new Error('asdasd');

    const first = path[0];

    if (isPrimitive(obj))
        throw new Error('Can not set property for primitive');

    if (path.length === 1) {
        obj[first] = value;
    } else {
        if (isNull(obj[first]))
            obj[first] = {};
        setField(obj[first], path.slice(1), value);
    }
    return obj;
}

export function mayDefault<T>(value: T | undefined | null, defaultValue?: T): T {
    if (value !== void 0 && value !== null)
        return value;
    if (defaultValue === void 0 || defaultValue === null)
        return null;

    return defaultValue;
}


export function isNull(obj: any): boolean {
    return obj === void 0 || obj === null;
}

export function isPrimitive(obj: any): boolean {
    if (isNull(obj))
        return true;
    if (typeof obj === 'object')
        return false;
    return true;
}
