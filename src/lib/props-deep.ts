import traverse from "traverse" ;
import objectPath from "object-path" ;
import {cloneDeep, zip} from "lodash-es" ;

declare global {
    interface PromiseConstructor {
        propsDeep: typeof propsDeep;
    }
}

interface PropsDeepTraverseResult<T extends object> {
    promises: Promise<unknown>[],
    paths: string[][],
    primitiveObj: T,
}

export default async function propsDeep<T extends object, K extends keyof T>(obj: T): Promise<Record<K, Awaited<T[K]>>> {
    const {promises, paths, primitiveObj} = traverse(obj).reduce(
        function fn(prev: PropsDeepTraverseResult<T>, curr: unknown) {
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
    console.log(promises) ;

    const promiseResult = await Promise.all(promises) ;
    zip(promiseResult, paths).forEach(([value, path]) => {
        objectPath.set(primitiveObj, path!, value) ;
    }) ;
    // @ts-expect-error
    return primitiveObj ;
}
