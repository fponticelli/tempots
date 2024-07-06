import { Size } from './size'

export interface Heading {
  fontSize: number
  lineHeight: number
  fontWeight: number
}

export interface UIStyles {
  dir: 'ltr' | 'rtl'
  defaultRadius: Size
  lineHeight: number
  background: {
    color: string
    mutedColor: string
    inverseColor: string
    inverseMutedColor: string
    accentColor: string
    inverseAccentColor: string
  }
  spacing: {
    [key in Size]: number
  }
  font: {
    family: {
      heading: string
      sans: string
      control: string
      mono: string
    }
    size: {
      [key in Size]: number
    }
    color: string
    mutedColor: string
    inverseColor: string
    inverseMutedColor: string
  }
  border: {
    radius: {
      [key in Size]: number
    }
  }
  shadow: {
    [key in Size]: string
  }
  breakpoint: {
    [key in Size]: number
  }
  heading: {
    h1: Heading
    h2: Heading
    h3: Heading
    h4: Heading
    h5: Heading
    h6: Heading
  }
  control: {
    height: {
      [key in Size]: number
    }
    focusColor: string
    borderColor: string
    accentTextShadow: string
    shadow: string
  }
}

export const defaultLightStyles: UIStyles = {
  dir: 'ltr',
  defaultRadius: 'sm',
  lineHeight: 1.45,
  background: {
    color: '#fff',
    mutedColor: '#f5f5f5',
    inverseColor: '#333',
    inverseMutedColor: '#666',
    accentColor: '#0074d9',
    inverseAccentColor: '#7fdbff'
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32
  },
  font: {
    family: {
      heading:
        '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
      control:
        '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
      sans: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace'
    },
    size: {
      xxs: 10,
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24
    },
    color: '#333',
    mutedColor: '#666',
    inverseColor: '#fff',
    inverseMutedColor: '#ccc'
  },
  border: {
    radius: {
      xxs: 1,
      xs: 2,
      sm: 4,
      md: 8,
      lg: 16,
      xl: 24,
      xxl: 32
    }
  },
  shadow: {
    xxs: '0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 1px rgba(0, 0, 0, 0.1)',
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px',
    md: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
    lg: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 28px 23px -7px, rgba(0, 0, 0, 0.04) 0px 12px 12px -7px',
    xl: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 36px 28px -7px, rgba(0, 0, 0, 0.04) 0px 17px 17px -7px',
    xxl: '0 1px 5px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 44x 44px -9px, rgba(0, 0, 0, 0.04) 0px 22px 22px -9px'
  },
  breakpoint: {
    xxs: 384,
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1400,
    xxl: 1800
  },
  heading: {
    h1: { fontSize: 34, lineHeight: 1.3, fontWeight: 700 },
    h2: { fontSize: 26, lineHeight: 1.35, fontWeight: 700 },
    h3: { fontSize: 22, lineHeight: 1.4, fontWeight: 700 },
    h4: { fontSize: 18, lineHeight: 1.45, fontWeight: 700 },
    h5: { fontSize: 16, lineHeight: 1.5, fontWeight: 700 },
    h6: { fontSize: 14, lineHeight: 1.5, fontWeight: 700 }
  },
  control: {
    height: {
      xxs: 20,
      xs: 24,
      sm: 28,
      md: 32,
      lg: 36,
      xl: 40,
      xxl: 44
    },
    focusColor: '#007bff',
    borderColor: '#ccc',
    accentTextShadow: '0 0 1px #0074d9', // '0 1.5px 1px rgba(0, 0, 0, 0.1)'
    shadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.2)'
  }
}

export const defaultDarkStyles: UIStyles = {
  ...defaultLightStyles,
  background: {
    ...defaultLightStyles.background,
    color: '#333',
    mutedColor: '#666',
    inverseColor: '#fff',
    inverseMutedColor: '#ccc'
  },
  font: {
    ...defaultLightStyles.font,
    color: '#fff',
    mutedColor: '#ccc',
    inverseColor: '#333',
    inverseMutedColor: '#666'
  },
  control: {
    ...defaultLightStyles.control,
    borderColor: '#666',
    accentTextShadow: '0 0 1px #7fdbff', // '0 1.5px 1px rgba(100, 100, 100, 0.1)'
    shadow: '0px 0px 1px 1px rgba(255, 255, 255, 0.15)'
  }
}
