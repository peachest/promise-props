import {init} from "../dist" ;
import {randomReject, randomResolve} from "./utils/utils.js" ;

init() ;

describe("Test Promise.propsDeep", () => {
    test("should resolve an empty object when passed an empty object", async () => {
        await expect(Promise.propsDeep({})).resolves.toEqual({}) ;
    }) ;

    test("should ignore nonenumerable properties", async () => {
        const obj = {
            name: Promise.resolve("promise"),
            age: 123,
        } ;
        Object.defineProperty(obj, "country", {
            writable: true,
            configurable: true,
            enumerable: false,
            value: Promise.resolve("node"),
        }) ;
        await expect(Promise.propsDeep(obj))
            .resolves.toEqual({
                age: 123,
                name: "promise",
            }) ;
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
            err: randomReject("Rejected"),
        })).rejects.toEqual("Rejected") ;
    }) ;

    test("should reject with the reason of a rejected Promise property when an object with a nested rejected Promise property is passed", async () => {
        await expect(Promise.propsDeep(
            {
                nest: {
                    err: randomReject("Rejected"),
                },
            },
        )).rejects.toEqual("Rejected") ;
    }) ;
}) ;
