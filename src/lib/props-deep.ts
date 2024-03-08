import traverse from "traverse" ;
import objectPath from "object-path" ;
import {cloneDeep, zip} from "lodash-es" ;

interface PropsDeepTraverseResult<T extends object> {
    promises: Promise<unknown>[],
    paths: string[][],
    primitiveObj: T,
}

/**
 * The propsDeep() function takes an enumerable object as input and returns a single Promise.
 * This returned promise fulfills when all the input's promise properties fulfill (regardless of the property level) (including when an empty iterable is passed),
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
 * * Asynchronously fulfilled, when promise properties of all levels fulfill.
 * The fulfillment value is an object with the promise properties' fulfillment values, keeping the object structure.
 * For those none promise properties, their values will still be kept.
 * For none promise objects of any level, they will be shallow copied to the result object except for their promise properties.
 * For nonenumerable properties, their values will be ignored.
 *
 * * Asynchronously rejected, when any promise in the given object rejects.
 * The rejection reason is the rejection reason of the first promise that was rejected.
 *
 * @example A rejected example
 * ```js
 * const obj = {
 *      sub: {
 *          reject: Promise.reject("rejected")
 *      }
 * } ;
 * await Promise.props(obj) ;
 * ```
 * This will get a promise rejected with reason "rejected"
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
 *          country: "node"
 *      }
 * }
 * ```
 */
export default async function propsDeep<T extends object, K extends keyof T>(obj: T): Promise<Record<K, Awaited<T[K]>>> {
    const {promises, paths, primitiveObj} = traverse(obj).reduce(
        function (prev: PropsDeepTraverseResult<T>, curr: unknown) {
            if (curr instanceof Promise) {
                prev.promises.push(curr) ;
                prev.paths.push(this.path) ;
                objectPath.del(prev.primitiveObj, this.path) ;
            }
            return prev ;
        },
        {
            promises    : [],
            paths       : [],
            primitiveObj: cloneDeep(obj),
        },
    ) as PropsDeepTraverseResult<T> ;

    const promiseResult = await Promise.all(promises) ;
    zip(promiseResult, paths).forEach(([value, path]) => {
        objectPath.set(primitiveObj, path!, value) ;
    }) ;
    // @ts-expect-error
    return primitiveObj ;
}
