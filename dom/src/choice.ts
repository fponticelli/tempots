export type Choice2<V1, V2> =
    | { type: 'Choice1Of2'; value: V1 }
    | { type: 'Choice2Of2'; value: V2 }

function choice1Of2<V1>(value: V1): Choice2<V1, never> {
    return { type: 'Choice1Of2', value }
}

function choice2Of2<V2>(value: V2): Choice2<never, V2> {
    return { type: 'Choice2Of2', value }
}

export const Choice2 = {
    map<VA1, VA2, VB1, VB2>(
        c: Choice2<VA1, VA2>,
        fa: (v: VA1) => VB1,
        fb: (v: VA2) => VB2
    ): Choice2<VB1, VB2> {
        switch (c.type) {
            case 'Choice1Of2':
                return choice1Of2(fa(c.value))
            case 'Choice2Of2':
                return choice2Of2(fb(c.value))
        }
    },
    one: choice1Of2,
    two: choice2Of2,
    _1: choice1Of2,
    _2: choice2Of2
}