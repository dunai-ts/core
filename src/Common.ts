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
 * Object with any additional options
 * @protected
 */
export interface IObject {
    [key: string]: any;
}
