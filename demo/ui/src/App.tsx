import { Consumer, Prop, Signal } from '@tempots/dom'
import { StyleProvider, Box, Button, StyleMarker, UITheme, TextInput, Stack, Size, AlignItems } from '@tempots/ui'

export const App = () => {
  return <StyleProvider><Content /></StyleProvider>
}

export const Content = () => {
  const text = Prop.of('hello world!')
  return (
    <Box
      p="lg"
      sx={{
        height: '100%',
        textAlign: 'center',
        padding: 20
      }}
    >
      <Stack spacing={Signal.of('xs' as Size)} align={Signal.of('center' as AlignItems)}>
        <Consumer mark={StyleMarker}>
        {({ isLight }: UITheme) => {
          return <Button onClick={() => isLight.update(v => !v)}>Change theme!</Button>
        }}
        </Consumer>
        <TextInput value={text} onChange={text.set} />
        <Button disabled={Signal.of(true)}>
        Do not click me
        </Button>
      </Stack>
    </Box>
  )
}
