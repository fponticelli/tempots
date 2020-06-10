// import { flatten } from 'tempo-std/lib/arrays'

export interface RuleDescription {
  selector: string
  rules: string[]
}

export interface ClassDescription {
  cls: string
  desc: RuleDescription[]
}

// export interface FeatureDescription {
//   cls: string
//   key: string
//   variables: string[]
//   desc: RuleDescription[]
// }

export const features = {
  orientation: {
    row: {
      cls: 'r',
      desc: [
        {
          selector: '.r',
          rules: ['display: flex']
        }
      ]
    } as ClassDescription,
    col: {
      cls: 'c',
      desc: [
        {
          selector: '.c',
          rules: ['display: flex', 'flex-direction: column']
        }
      ]
    } as ClassDescription
  },
  control: {
    cls: 'ctrl',
    desc: []
  },
  inline: {
    cls: 'i',
    desc: [
      {
        selector: '.i',
        rules: ['display: inline-block']
      }
    ]
  } as ClassDescription,
  background: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}bg`,
    desc: [
      {
        selector: `.${prefix}bg${pseudo}`,
        rules: [`background: var(--${prefix}bg)`]
      }
    ]
  }),
  borderRadius: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}br`,
    desc: [
      {
        selector: `.${prefix}br${pseudo}`,
        rules: [`border-radius: var(--${prefix}br)`]
      }
    ]
  }),
  cursor: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}cu`,
    desc: [
      {
        selector: `.${prefix}cu${pseudo}`,
        rules: [`cursor: var(--${prefix}cu)`]
      }
    ]
  }),
  padding: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}p`,
    desc: [
      {
        selector: `.${prefix}p${pseudo}`,
        rules: [
          `padding-top: var(--${prefix}p-t)`,
          `padding-right: var(--${prefix}p-r)`,
          `padding-bottom: var(--${prefix}p-b)`,
          `padding-left: var(--${prefix}p-l)`
        ]
      }
    ]
  }),
  userSelect: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}us`,
    desc: [
      {
        selector: `.${prefix}us${pseudo}`,
        rules: [`user-select: var(--${prefix}us)`]
      }
    ]
  }),
  fontFamily: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}ff`,
    desc: [
      {
        selector: `.${prefix}ff${pseudo}`,
        rules: [`font-family: var(--${prefix}ff)`]
      }
    ]
  }),
  fontSize: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}fs`,
    desc: [
      {
        selector: `.${prefix}fs${pseudo}`,
        rules: [`font-size: var(--${prefix}fs)`]
      }
    ]
  }),
  textColor: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}tc`,
    desc: [
      {
        selector: `.${prefix}tc${pseudo}`,
        rules: [`color: var(--${prefix}tc)`]
      }
    ]
  }),
  transition: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}t`,
    desc: [
      {
        selector: `.${prefix}t${pseudo}`,
        rules: [`transition: var(--${prefix}t)`]
      }
    ]
  }),
  width: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}w`,
    desc: [
      {
        selector: `.${prefix}w${pseudo}`,
        rules: [
          `min-width: var(--${prefix}w-mi)`,
          `max-width: var(--${prefix}w-ma)`,
          `flex: var(--${prefix}w-f) var(--${prefix}w-f) 0`
        ]
      },
      {
        selector: `.uood > .${prefix}w${pseudo}`,
        rules: [`width: calc(var(--${prefix}w-f) / var(--${prefix}w-f) * 100%)`]
      },
      {
        selector: `.c > .w`,
        rules: [`flex: none`]
      }
    ]
  }),
  height: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}h`,
    desc: [
      {
        selector: `.${prefix}h${pseudo}`,
        rules: [
          `min-height: var(--${prefix}h-mi)`,
          `max-height: var(--${prefix}h-ma)`,
          `flex: var(--${prefix}h-f) var(--${prefix}h-f) 0`
        ]
      },
      {
        selector: `.uood > .${prefix}h${pseudo}, .r > .${prefix}h${pseudo}`,
        rules: [
          `height: calc(var(--${prefix}h-f) / var(--${prefix}h-f) * 100%)`
        ]
      }
    ]
  }),
  fill: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}f`,
    desc: [
      {
        selector: `.r > .${prefix}f${pseudo}`,
        rules: [
          `flex-grow: var(--${prefix}f)`,
          `flex-shrink: var(--${prefix}f)`,
          `flex-basis: 10%`
        ]
      },
      {
        selector: `.c > .${prefix}f${pseudo}`,
        rules: [
          `flex-grow: var(--${prefix}f)`,
          `flex-shrink: var(--${prefix}f)`,
          `flex-basis: 10%`
        ]
      }
    ]
  }),
  border: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}b`,
    desc: [
      {
        selector: `.${prefix}b${pseudo}`,
        rules: [
          `border-top: var(--${prefix}b-t)`,
          `border-right: var(--${prefix}b-r)`,
          `border-bottom: var(--${prefix}b-b)`,
          `border-left: var(--${prefix}b-l)`,
          `border-image: var(--${prefix}bi)`
        ]
      }
    ]
  }),
  overflowHorizontal: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}oh`,
    desc: [
      {
        selector: `.${prefix}oh${pseudo}`,
        rules: [`overflow-x: var(--${prefix}oh)`]
      }
    ]
  }),
  overflowVertical: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}ov`,
    desc: [
      {
        selector: `.${prefix}ov${pseudo}`,
        rules: [`overflow-y: var(--${prefix}ov)`]
      }
    ]
  }),
  spacing: {
    cls: `sp`,
    desc: [
      {
        selector: `.r.sp > *`,
        rules: [`margin-right: var(--sp)`]
      },
      {
        selector: `.r.sp > *:last-child`,
        rules: [`margin-right: 0`]
      },
      {
        selector: `.c.sp > *`,
        rules: [`margin-bottom: var(--sp)`]
      },
      {
        selector: `.c.sp > *:last-child`,
        rules: [`margin-bottom: 0`]
      },
      // {
      //   selector: `.sp > p:last-child`,
      //   rules: [`margin-bottom: 0`]
      // },
      // {
      //   selector: `.sp > .r`,
      //   rules: [`margin-bottom: var(--sp)`]
      // },
      {
        selector: `.ctrl`,
        rules: [`margin-right: var(--sp)`]
      },
      {
        selector: `.ctrl:last-child`,
        rules: [`margin-right: 0`]
      },
      {
        selector: `.c > .ctrl`,
        rules: [`margin-right: 0`]
      }
    ]
  } as ClassDescription,
  horizontalDistribution: {
    cls: `hd`,
    desc: [
      {
        selector: `.r.hd`,
        rules: [`justify-content: var(--hd)`]
      },
      {
        selector: `.c.hd`,
        rules: [`align-content: var(--hd)`]
      }
    ]
  } as ClassDescription,
  verticalDistribution: {
    cls: `vd`,
    desc: [
      {
        selector: `.r.vd`,
        rules: [`align-items: var(--vd)`]
      },
      {
        selector: `.c.vd`,
        rules: [`justify-content: var(--vd)`]
      }
    ]
  } as ClassDescription,
  selfHorizontalDistribution: {
    cls: `shd`,
    desc: [
      {
        selector: `.r > .shd`,
        rules: [`justify-self: var(--shd)`]
      },
      {
        selector: `.c > .shd`,
        rules: [`align-self: var(--shd)`]
      }
    ]
  } as ClassDescription,
  selfVerticalDistribution: {
    cls: `svd`,
    desc: [
      {
        selector: `.r > .svd`,
        rules: [`align-self: var(--svd)`]
      },
      {
        selector: `.c > .svd`,
        rules: [`justify-self: var(--svd)`]
      }
    ]
  } as ClassDescription,

  // alignItems: {
  //   cls: `a`,
  //   desc: [
  //     {
  //       selector: `.a`,
  //       rules: [`align-content: var(--a)`]
  //     }
  //   ]
  // } as ClassDescription,
  // alignSelf: {
  //   cls: `sa`,
  //   desc: [
  //     {
  //       selector: `.sa`,
  //       rules: [`align-self: var(--sa)`]
  //     }
  //   ]
  // } as ClassDescription,

  // justifyContent: {
  //   cls: `d`,
  //   desc: [
  //     {
  //       selector: `.d`,
  //       rules: [`justify-content: var(--d)`]
  //     }
  //   ]
  // } as ClassDescription,
  // justifySelf: {
  //   cls: `da`,
  //   desc: [
  //     {
  //       selector: `.da`,
  //       rules: [`justify-self: var(--da)`]
  //     }
  //   ]
  // } as ClassDescription,
  boxShadow: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}bs`,
    desc: [
      {
        selector: `.${prefix}bs${pseudo}`,
        rules: [`box-shadow: var(--${prefix}bs)`]
      }
    ]
  }),
  textShadow: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}ts`,
    desc: [
      {
        selector: `.${prefix}ts${pseudo}`,
        rules: [`text-shadow: var(--${prefix}ts)`]
      }
    ]
  }),
  textDirection: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}td`,
    desc: [
      {
        selector: `.${prefix}td${pseudo}`,
        rules: [`direction: var(--${prefix}td)`]
      }
    ]
  }),
  fontVariantLigatures: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}fl`,
    desc: [
      {
        selector: `.${prefix}fl${pseudo}`,
        rules: [`font-variant-ligatures: var(--${prefix}fl)`]
      }
    ]
  }),
  fontVariantNumeric: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}fn`,
    desc: [
      {
        selector: `.${prefix}fn${pseudo}`,
        rules: [`font-variant-numeric: var(--${prefix}fn)`]
      }
    ]
  }),
  fontStyle: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}fst`,
    desc: [
      {
        selector: `.${prefix}fst${pseudo}`,
        rules: [`font-style: var(--${prefix}fst)`]
      }
    ]
  }),
  fontWeight: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}fw`,
    desc: [
      {
        selector: `.${prefix}fw${pseudo}`,
        rules: [`font-weight: var(--${prefix}fw)`]
      }
    ]
  }),
  letterSpacing: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}ls`,
    desc: [
      {
        selector: `.${prefix}ls${pseudo}`,
        rules: [`letter-spacing: var(--${prefix}ls)`]
      }
    ]
  }),
  lineHeight: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}lh`,
    desc: [
      {
        selector: `.${prefix}lh${pseudo}`,
        rules: [`line-height: var(--${prefix}lh)`]
      }
    ]
  }),
  tabSize: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}tts`,
    desc: [
      {
        selector: `.${prefix}tts${pseudo}`,
        rules: [
          `white-space: var(--tts${prefix}-ws, pre-wrap)`,
          `tab-size: var(--tts${prefix})`
        ]
      }
    ]
  }),
  whiteSpace: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}ws`,
    desc: [
      {
        selector: `.${prefix}ws${pseudo}`,
        rules: [`white-space: var(--${prefix}ws)`]
      }
    ]
  }),
  textAlign: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}ta`,
    desc: [
      {
        selector: `.${prefix}ta${pseudo}`,
        rules: [`text-align: var(--${prefix}ta)`]
      }
    ]
  }),
  textOverflow: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}to`,
    desc: [
      {
        selector: `.${prefix}to${pseudo}`,
        rules: [
          `white-space: nowrap`,
          `overflow: hidden`,
          `text-overflow: var(--${prefix}to)`
        ]
      }
    ]
  }),
  textDecoration: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}tde`,
    desc: [
      {
        selector: `.${prefix}tde${pseudo}`,
        rules: [`text-decoration: var(--${prefix}tde)`]
      }
    ]
  }),
  textTransform: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}tt`,
    desc: [
      {
        selector: `.${prefix}tt${pseudo}`,
        rules: [`text-transform: var(--${prefix}tt)`]
      }
    ]
  }),
  wordBreak: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}wb`,
    desc: [
      {
        selector: `.${prefix}wb${pseudo}`,
        rules: [`word-break: var(--${prefix}wb)`]
      }
    ]
  }),
  wordSpacing: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}wsp`,
    desc: [
      {
        selector: `.${prefix}wsp${pseudo}`,
        rules: [`word-spacing: var(--${prefix}wsp)`]
      }
    ]
  }),
  writingMode: (prefix: string, pseudo: string): ClassDescription => ({
    cls: `${prefix}wm`,
    desc: [
      {
        selector: `.${prefix}wm${pseudo}`,
        rules: [`writing-mode: var(--${prefix}wm)`]
      }
    ]
  })
}
