import {init} from "../dist" ;
import {randomReject, randomResolve} from "./utils/utils.js" ;

init() ;

describe("Test Promise.propsDeep", () => {
    test("should resolve an empty object when passed an empty object", async () => {
        await expect(Promise.propsDeep({})).resolves.toEqual({}) ;
    }) ;

    test("should resolve with nested promise property and promise in nested object", async () => {
        await expect(Promise.propsDeep({
            primitive: "foo",
            rootPromise: randomResolve(123),
            nestedPromise: randomResolve(randomResolve("nestedPromise")),
            nestedObject: {
                promise: randomResolve(456),
                primitive: "bar",
            },
        }))
            .resolves.toEqual({
                rootPromise: 123,
                primitive: "foo",
                nestedPromise: "nestedPromise",
                nestedObject: {
                    promise: 456,
                    primitive: "bar",
                },
            }) ;
    }) ;

    test("should reject with the reason of a rejected Promise property when an object with a rejected Promise property is passed", async () => {
        await expect(Promise.propsDeep({
            err: randomReject(new Error("Rejected")),
        })).rejects.toThrow("Rejected") ;
    }) ;

    test("should reject with the reason of a rejected Promise property when an object with a nested rejected Promise property is passed", async () => {
        await expect(Promise.propsDeep(
            {
                nest: {
                    err: randomReject(new Error("Rejected")),
                },
            },
        )).rejects.toThrow("Rejected") ;
    }) ;
}) ;
