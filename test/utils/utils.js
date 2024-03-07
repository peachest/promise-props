import {setTimeout} from "node:timers" ;

function randomInterval(min = 100, max = 200) {
    if (min > max) throw new Error(`Interval min should be less than or equal to max. Got min:${min} and max:${max}`) ;
    return Math.random() * (max - min) + min ;
}

export function randomResolve(value) {
    return new Promise((resolve) => {
        setTimeout(() => void resolve(value), randomInterval()) ;
    }) ;
}

export function randomReject(reason) {
    return new Promise((resolve, reject) => {
        setTimeout(() => void reject(reason), randomInterval()) ;
    }) ;
}
