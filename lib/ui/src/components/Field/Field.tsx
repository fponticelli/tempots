import { Consumer, HiddenWhenEmpty, JSX, Signal, When } from '@tempots/dom'
import { Box } from '../Box/Box'
import { FieldsetMark, FieldsetProvider } from '../Fieldset/fieldset-context'
import { FieldLayout } from './field-layout'

export interface FieldProps {
  children?: JSX.DOMNode
  description?: JSX.DOMNode
  error?: JSX.DOMNode
  label?: JSX.DOMNode
  layout?: Signal<FieldLayout>
  required?: Signal<boolean>
}

const layoutToFlexDirection = (layout: FieldLayout): any => {
  // TODO: any
  switch (layout) {
    case 'horizontal':
      return 'row'
    case 'vertical':
      return 'column'
  }
}

export const Field = ({ children, ...props }: FieldProps) => {
  return (
    <Consumer mark={FieldsetMark}>
      {({ layout: fsLayout }: FieldsetProvider) => {
        const required = props.required ?? Signal.of(false)
        const layout = props.layout ?? fsLayout
        const error = props.error
        const label = Signal.of(props.label)
        const description = props.description
        const isHorizontal = layout.map(v => v === 'horizontal')
        return (
          // TODO force vertical layout if there is not enough space
          <Box
            sx={{
              display: 'flex',
              flexDirection: layout.map(layoutToFlexDirection)
            }}
          >
            {/* TODO use value from theme */}
            <Box
              width={isHorizontal.map<number | undefined>(v =>
                v ? 200 : undefined
              )}
            >
              <Box
              // sx={{
              //   minHeight: isHorizontal.map(v => (v ? ('36px' as any) : undefined)) // TODO
              // }}
              >
                {label}
                <When is={required}><span> *</span></When>
              </Box>
              <Box
                sx={{
                  fontSize: '0.8em' // TODO
                }}
              >
                <HiddenWhenEmpty />
                {description}
              </Box>
            </Box>
            <Box
              sx={{
                flex: isHorizontal.map(v => (v ? '1 1 auto' : undefined) as any)
              }} // TODO any
            >
              <Box>{children}</Box>
              <Box>
                <HiddenWhenEmpty />
                {error}
              </Box>
            </Box>
          </Box>
        )
      }}
    </Consumer>
  )
}
