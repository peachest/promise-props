import fs from "fs-extra";
import {globbySync} from "globby";
import json5 from "json5";
import path from "path";
import url from "url";

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import clear from "rollup-plugin-clear";
import {dts} from "rollup-plugin-dts";
import keepHeaderComment from "rollup-plugin-keep-header-comment";
import externals from "rollup-plugin-node-externals";
import typescript from "rollup-plugin-typescript2";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolve = p => path.resolve(__dirname, p);

const packageJSONPath = resolve("package.json");
const tsconfigJSONPath = resolve("tsconfig.json");
const packageJson = json5.parse(fs.readFileSync(packageJSONPath).toString());
const tsconfigJson = json5.parse(fs.readFileSync(tsconfigJSONPath).toString());

const input = globbySync("src/**/*.ts", {
    cwd: __dirname,
    expandDirectories: {
        extensions: ["ts"],
    },
});

const {
    outDir: outputDir,
    sourceMap: sourcemap,
} = tsconfigJson["compilerOptions"];

const {
    name: pkgName,
    types: declarationFile,
} = packageJson;
let name = path.basename(pkgName).replaceAll("-", "_");

const basePlugins = [
    clear({
        targets: [outputDir],
    }),
    json(),
    nodeResolve({
        preferBuiltins: false,
    }),
    commonjs(),
    typescript({
        tsconfigJson,
    }),
    externals(),
]

export default [
    // build source files
    {
        input,
        output: {
            dir: outputDir,
            format: "es",
            name,
            exports: "named",
            preserveModules: true,
        },
        plugins: [
            ...basePlugins
        ],
    },
    // build type declarations
    {
        input: "./src/index.ts",
        output: [{
            file: resolve(declarationFile),
            // dir: outputDir,
            format: "es"
        }],
        plugins: [
            ...basePlugins,
            dts({
                tsconfigJson,
            }),
            keepHeaderComment({
                sourcemap,
                pattern: /@packageDocumentation/,
            }),
        ]
    }
];
