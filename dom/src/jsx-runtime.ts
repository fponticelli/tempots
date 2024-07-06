// import { el, Template, LiteralOrDerived, text } from "./core"

// export declare namespace JSX {
//     interface IntrinsicElements<S, A, Q> {
//         text: { children: LiteralOrDerived<S, string> },
//         div: {
//             class?: LiteralOrDerived<S, string | undefined>;
//             prop?: LiteralOrDerived<S, number>;
//             children?: Template<S, A, Q>[]
//         };
//     }
// }

// export function jsx(name: string, attrs: any) {
//     if (name == "text") {
//         return text(attrs.children)
//     } else {
//         return el(name)
//     }
// }

// // jsx_runtime_1.jsx("div", { children: "hello" }, void 0)
