/**
 * Accessor designed for work with simple object or primitive
 * Do not use Accessor to works with class instances
 */
import {
    deepCopy,
    deepFreeze,
    getField,
    setField
} from './utils';

export class Accessor<T> {
    public static getValue<T>(container: T | Accessor<T>): T {
        if (container instanceof Accessor)
            return container.value;
        else
            return container;
    }

    public value: T;
    protected readonly originalValue: T;

    constructor(value: T) {
        this.originalValue = deepFreeze(value);
        this.value = this.originalValue;
    }

    public get(): T;
    public get(key: string | string[], defaultValue?: any): any;
    public get(key?: string | string[], defaultValue?: any): any {
        if (!key)
            return this.value;

        return getField(this.value, key, defaultValue);
    }

    public set(value: T): this;
    public set(key: string | string[], value: any): this;
    public set(key: T | string | string[], value?: any): this {
        // @ts-ignore
        if (value === void 0 || !key || !key.length) {
            this.value = deepFreeze(key as T);
            return this;
        }

        const path: string[] = typeof key === 'string' ? key.split('.') : key as string[];

        if (!Array.isArray(path))
            throw new Error('path must be string or array of strings');

        this.value = deepCopy(this.value);

        setField(this.value, path, value);

        this.value = deepFreeze(this.value);
        return this;
    }

    public getOriginal(): T {
        return this.originalValue;
    }
}
