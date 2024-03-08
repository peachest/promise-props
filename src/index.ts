/**
 * A simple extension for promise
 *
 * @packageDocumentation
 */
import props from "@/lib/props" ;
import propsDeep from "@/lib/props-deep" ;

declare global {
    interface PromiseConstructor {
        props: typeof props;
        propsDeep: typeof propsDeep;
    }
}

/**
 * Mount props and propsDeep functions onto Promise, so that they can be used as static methods of Promise
 *
 * @public
 *
 * @example
 * ```js
 * init() ;
 * await Promise.props() ;
 * await Promise.propsDeep() ;
 * ```
 */
export function init(): void {
    Promise.props = props ;
    Promise.propsDeep = propsDeep ;
}

export {
    props,
    propsDeep,
} ;
