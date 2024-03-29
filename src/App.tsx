import React from './core/React'

function Foo() {
  console.log('Foo render')

  const [count, setCount] = React.useState(1)

  return (
    <div>
      <button
        onClick={() => {
          setCount(1)
        }}
      >
        count {count}
      </button>
    </div>
  )
}

function App() {
  console.log('App render')

  return (
    <header id="app">
      <hr />

      <Foo />
    </header>
  )
}

export default App
