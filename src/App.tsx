import React from './core/React'

function Counter({ count }) {
  return <div>count {count}</div>
}

const CounterContainer = () => {
  return <Counter count={1} />
}

let count = 1
const App = () => {
  const click = () => {
    count++

    React.update()
    console.log('c')
  }

  return (
    <header id="app">
      <main>main</main>

      <button onClick={click}>button {count}</button>

      {/* <Counter count={1} />
      <footer>2</footer>
      <Counter count={3} /> */}

      {/* <CounterContainer /> */}
    </header>
  )
}

export default App
