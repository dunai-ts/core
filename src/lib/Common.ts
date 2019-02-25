/**
 * @module @dunai/core
 */

/**
 * Type for what object is instances of
 */
export type Type<T> = new (...args: any[]) => T;

/**
 * Generic `ClassDecorator` type
 */
export type GenericClassDecorator<T> = (target: T) => void;

/**
 * Interface for objects, they may have custom property
 * @protected
 */
export interface IObject {
    [key: string]: any;
}
