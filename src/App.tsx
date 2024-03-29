import React from './core/React'

let countFoo = 1
function Foo() {
  console.log('Foo render')

  const up = React.update()

  return (
    <button
      onClick={() => {
        countFoo++

        up()
      }}
    >
      foo {countFoo}
    </button>
  )
}

let countBar = 1
function Bar() {
  console.log('Bar render')

  const up = React.update()

  return (
    <button
      onClick={() => {
        countBar++
        up()
      }}
    >
      bar {countBar}
    </button>
  )
}

let countApp = 1
function App() {
  console.log('App render')

  const up = React.update()

  return (
    <header id="app">
      <button
        onClick={() => {
          countApp++
          up()
        }}
      >
        {countApp}
      </button>

      <hr />

      <Foo />
      <Bar />
    </header>
  )
}

export default App
