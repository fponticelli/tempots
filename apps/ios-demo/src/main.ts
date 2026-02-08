import { prop } from '@tempots/core'
import {
  renderNative,
  view,
  nativeStyle,
  nativeOn,
} from '@tempots/native'

const count = prop(0)

renderNative(
  view.View(
    view.Text(
      count.map(n => `Count: ${n}`),
      nativeStyle.style({
        fontSize: 72,
        color: '#333333',
        textAlign: 'center',
      })
    ),
    view.View(
      view.View(
        nativeOn.press(() => count.set(count.value - 1)),
        view.Text('-'),
        nativeStyle.style({
          backgroundColor: '#6677aa',
          padding: 16,
          borderRadius: 8,
          width: 80,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        })
      ),
      view.View(
        nativeOn.press(() => count.set(count.value + 1)),
        view.Text('+'),
        nativeStyle.style({
          backgroundColor: '#6677aa',
          padding: 16,
          borderRadius: 8,
          width: 80,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        })
      ),
      nativeStyle.style({
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 300,
        marginTop: 32,
      })
    ),
    nativeStyle.style({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ddeeff',
    })
  )
)
