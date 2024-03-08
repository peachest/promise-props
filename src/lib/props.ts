import {zip} from "lodash-es" ;

const propertyIsEnumerable = Object.prototype.propertyIsEnumerable ;

/**
 * The props() function takes an enumerable object as input and returns a single Promise.
 * This returned promise fulfills when all the input's top level promise properties fulfill (including when an empty iterable is passed),
 * with an object of the fulfillment values as properties.
 * It rejects when any of the input's property rejects, with this first rejection reason.
 *
 * @public
 * @typeParam T - type of obj
 * @typeParam K - type of obj keys
 * @param obj - An object with promise properties
 *
 * @returns A promise that is:
 *
 * * Already fulfilled, if the object passed has no enumerable properties
 *
 * * Asynchronously fulfilled, when all the top level promise properties fulfill.
 * The fulfillment value is an object with the promise properties' fulfillment values, keeping the object structure.
 * For those none promise properties, their values will still be kept.
 * For top level none promise objects, they will be shallow copied to the result object.
 * For nonenumerable properties, their values will be ignored.
 *
 * * Asynchronously rejected, when any of the top level promise in the given object rejects.
 * The rejection reason is the rejection reason of the first promise that was rejected.
 *
 * @example A rejected example
 * ```js
 * const obj = {
 *      reject: Promise.reject("rejected")
 * } ;
 * await Promise.props(obj) ;
 * ```
 * This will get a promise rejected with reason "rejected"
 *
 * @example A won't rejected example
 * ```js
 * const obj = {
 *      sub: {
 *          reject: Promise.reject("rejected")
 *      }
 * } ;
 * await Promise.props(obj) ;
 * ```
 * This will resolved with the following result as `sub` is top level none promise object so that it will be shallow copied
 * ```js
 * result = {
 *      sub: {
 *          reject: Promise.reject("rejected")
 *      }
 * }
 * ```
 *
 * @example comprehensive demo for props() function
 * ```js
 * const obj = {
 *      name: "promise",
 *      age: Promise.resolve(123),
 *      nest: Promise.resolve(Promise.resolve("nest")),
 *      sub: {
 *          country: Promise.resolve("node"),
 *      }
 * } ;
 * Object.defineProperty(obj, "nonEnumerable", { value: "nonEnumerable", enumerable: false}) ;
 * await Promise.props(obj) ;
 * ```
 * The result will be like this:
 * ```js
 * result = {
 *      name: "promise",
 *      age: 123,
 *      nest: "nest",
 *      sub: {
 *          country: Promise.resolve("node"),
 *      }
 * }
 * ```
 */
export default async function props<T extends object, K extends keyof T>(obj: T): Promise<Record<K, Awaited<T[K]>>> {
    const ownKeys = Reflect.ownKeys(obj) as K[] ;
    const ownEnumerableKeys = ownKeys.filter((key) => propertyIsEnumerable.call(obj, key)) ;

    if (ownEnumerableKeys.length === 0) {
        // @ts-expect-error
        return {} ;
    }

    // @ts-expect-error
    const result: Record<K, Awaited<T[K]>> = {} ;
    const promiseKeys: K[] = [] ;
    const promises: Promise<unknown>[] = [] ;
    for (const key of ownEnumerableKeys) {
        const value = Reflect.get(obj, key) ;
        if (!(value instanceof Promise)) {
            // @ts-expect-error
            result[key] = value ;
            continue ;
        }
        promiseKeys.push(key) ;
        promises.push(value) ;
    }
    const values = await Promise.all(promises) ;

    zip(promiseKeys, values).forEach(([key, value]) => {
        // @ts-expect-error
        result[key] = value ;
    }) ;
    return result ;
}
