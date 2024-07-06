import { Prop, render } from "@tempots/dom"

const App = () => {
  const count = Prop.of(0)
  const disabled = count.map(v => v === 0)
  return (
    <div class="app">
      <div class="count count-small">count</div>
      <div class="count">{count}</div>
      <div class="buttons">
        <button disabled={disabled} onClick={() => count.update(v => v - 1)}>-</button>
        <button onClick={() => { count.update(v => v + 1) }}>+</button>
      </div>
    </div>
  )
}

render(<App />, document.body)
