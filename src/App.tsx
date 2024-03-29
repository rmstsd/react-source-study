import React from './core/React'

let showBar = false

function Counter() {
  const bar = <div>bar</div>

  const click = () => {
    showBar = !showBar

    React.update()
  }

  return (
    <div>
      <button onClick={click}>up</button>

      {showBar && bar}

      <div>222</div>

    </div>
  )
}

const App = () => {
  return (
    <header id="app">
      <hr />

      <Counter />

    </header>
  )
}

export default App
