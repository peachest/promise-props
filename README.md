# promise-props

<img alt="NPM Version" src="https://img.shields.io/npm/v/%40pearden%2Fpromise-props?logo=npm"/><img alt="NPM Downloads" src="https://img.shields.io/npm/dt/%40pearden%2fpromise-props?label=total%20downloads">![GitHub last commit (branch)](https://img.shields.io/github/last-commit/peachest/promise-props/main)<img alt="GitHub License" src="https://img.shields.io/github/license/peachest/promise-props"/>

<img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/peachest/promise-props/npm-publish.yml?label=npm-publish%20Action"><img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/peachest/promise-props/github-pages.yml?label=api-pages-deploy%20Action">

<p align="center">
    <br />
A simple extension for promise
    <br />
    <br />
    <a href="README.md">English</a>
    ·
    <a href="README_zh.md">简体中文</a>
    <br />
    <br />
    <a href="#Usage">Usage</a>
    ·
    <a href="https://github.com/peachest/promise-props/issues">Report Bug</a>
    ·
    <a href="https://peachest.github.io/promise-props/">API Documentation</a>
    <br />
    <br />
    <a href="https://stats.deeptrain.net/">
        <img src="https://stats.deeptrain.net/repo/peachest/promise-props" alt="Stat"/>
    </a>
</p>


## Table of Contents

* [Feature](#Feature)
* [Installation](#Installation)
* [Quick Start](#quick-start)
* [Usage](#Usage)
* [FAQs](#FAQs)
* [Test](#Test)
* [Build](#build)
* [Publish](#publish)
* [See Also](#see-also)



## Feature

1. Provide `propsDeep()` to deal with object with promises nested in deep level
2. Enable calling functions as other static methods on Promise by mounting with`init()`
3. Support ES6 module.
4. Support typescript. Provide type declaration
5. Provide detailed documentation including: README, tsDoc in IDE and [API pages](https://peachest.github.io/promise-props/)



## Installation

```sh
npm install @pearden/promise-props
# or
yarn add @pearden/promise-props
```

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

## Quick Start

```typescript
// mount props() and propsDeep() methods on Promise
init() ;

await Promise.props({
    name: "promise",
    age: Promise.resolve(123),
}) ;
/* output
{
	name: "promise",
	age: 123,
}
*/

await Promise.propsDeep({
    sub: {
        name: "promise",
        age: Promise.resolve(123),
    }
}) ;
/* output
{
	sub: {
        name: "promise",
        age: 123,
    }
}
*/
```

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

## Usage

**Import**

```typescript
// Enable calling like Promise.props and Promise.propsDeep
// Do this in your main.[ts|js] file
init()

// or import whenever you want
import {props, propsDeep} from "promise-props"
```



### Props

Like `Promise.all`，but only deal with top level promise in the object passed in.

* Other top level none promise properties will be shallow copied to the result object
* Nonenumerable properties will be ignored.



### PropsDeep

Deal with any level promise nested in the object passed into function.

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

## FAQs

### How `props()` is implemented

Notice: nonenumerable properties will always be ignored.

All the top level promise will be extract into an array. Then call `Promise.all` on this array. If all promises reslove, then the resolve value will be set into result object with the origin key of promise properties.

If any top level promise reject, as `props()` is an async function, it will automatically return an promise with the same reject reason.

Finally, other top level properties will be shallow copied to result object.



### How `propsDeep()` is implemented

Use `lodash` to deep copy the object passed in as the result object

Use `tarverse` to traverse object filtering out all promise properties at any level and record the property path in the object.

Call `Promise.all` on promises array and get an array of all resloved value.

Use``object-path` lib to set value into result object with paths

Finally return the result

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

## Test

This project use jest for testing

```sh
yarn test
```

Check [test](./test) directory for detail.



## Build

This project use Rollup to build.

```sh
# build once
yarn build

# build with file watching
yarn build:watch
```



For detailed building configuration, check [rollup config](./rollup.config.mjs).

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

## Publish

### Local publish

Publish NPM package with yarn

```sh
yarn publish --acccess public
```



### Github Action

Auto publish to NPM when a Github release or prerelease is published.

Check for [workflow](./.github/workflows/npm-publish.yml) config.

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

## See Also

[petkaantonov/bluebird: :bird: Bluebird is a full featured promise library with unmatched performance](https://github.com/petkaantonov/bluebird)

[sindresorhus/p-props: Like `Promise.all()` but for `Map` and `Object`](https://github.com/sindresorhus/p-props)

[promise-props](https://www.npmjs.com/package/promise-props)

[Siilwyn/promise-all-props: Like `Promise.all` but for object properties.](https://github.com/Siilwyn/promise-all-props)

[magicdawn/promise.obj: promise.obj / promise.props](https://github.com/magicdawn/promise.obj)

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>
