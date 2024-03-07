import props from "@/lib/props" ;
import propsDeep from "@/lib/props-deep" ;

export function init(): void {
    Promise.props = props ;
    Promise.propsDeep = propsDeep ;
}
