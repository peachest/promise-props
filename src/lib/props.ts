declare global {
    interface PromiseConstructor {
        props: typeof props;
    }
}

export default async function props<T extends object, K extends keyof T>(obj: T): Promise<Record<K, Awaited<T[K]>>> {
    // @ts-expect-error
    const result: Record<K, Awaited<T[K]>> = {} ;
    const ownKeys = Reflect.ownKeys(obj) as K[] ;
    const keys: K[] = [] ;
    const promises: Promise<any>[] = [] ;

    for (const key of ownKeys) {
        const value = Reflect.get(obj, key) ;
        if (!(value instanceof Promise)) {
            // @ts-expect-error
            result[key] = value ;
            continue ;
        }
        keys.push(key) ;
        promises.push(value) ;
    }
    const values = await Promise.all(promises) ;
    for (let i = 0 ;i < keys.length ;i++) {
        //@ts-expect-error
        result[keys[i]] = values[i] ;
    }
    return result ;
}
