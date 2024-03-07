import {init} from "../dist" ;
import {randomReject, randomResolve} from "./utils/utils.js" ;

init() ;


describe("Test Promise.props", () => {
    const name = "peachest" ;
    const namePromise = randomResolve(name) ;

    const age = 24 ;
    const agePromise = randomResolve(age) ;

    const country = "China" ;
    const countryPromise = randomResolve(country) ;

    const err = new Error("Rejected") ;

    test("should resolve an empty object when passed an empty object", async () => {
        await expect(Promise.props({})).resolves.toEqual({}) ;
    }) ;

    test("should resolve with the values of non-Promise properties when an object with non-Promise properties is passed", async () => {
        await
            expect(Promise.props({
                name,
                age,
                subObj: {
                    country: country,
                },
            })).resolves.toEqual({
                name,
                age,
                subObj: {
                    country: country,
                },
            }) ;
    }) ;

    test("should resolve with the resolved values of the 1st level Promise properties without deeper level Promise when an object with Promise properties is passed", async () => {
        await expect(Promise.props({
            name: namePromise,
            age: agePromise,
            nestPromise: randomResolve(randomResolve("nestPromise")),
            subObj: {
                country: countryPromise,
            },
        })).resolves.toEqual({
            name,
            age,
            nestPromise: "nestPromise",
            subObj: {
                country: countryPromise,
            },
        }) ;
    }) ;

    test("should reject with the reason of a rejected Promise property when an object with a rejected Promise property is passed", async () => {
        await expect(Promise.props({
            err: randomReject(err),
        })).rejects.toThrow("Rejected") ;
    }) ;
}) ;
