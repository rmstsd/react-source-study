import React from './core/React'

const CounterContainer = () => {
  return <Counter count={1} />
}

let bool = true

function Counter({ count }) {
  const click = () => {
    bool = !bool

    React.update()
  }

  return (
    <div>
      <button onClick={click}>up</button>

      <div>count {count}</div>
    </div>
  )
}

let domAttr = { id: 'aa' } as any
let count = 1

const Foo = () => <div>foo</div>
const App = () => {
  const foo = <Foo />
  const bar = <p>bar</p>

  const click = () => {
    count++

    delete domAttr.id

    domAttr.className = 'uu'
    bool = !bool

    React.update()
  }

  return (
    <header id="app">
      <button onClick={click} {...domAttr}>
        button {count}
      </button>

      {bool ? foo : bar}

      {/* <main>main</main> */}

      {/* <Counter count={1} /> */}

      {/* <footer>2</footer> */}
      {/* <Counter count={3} />  */}

      {/* <CounterContainer /> */}
    </header>
  )
}

export default App
