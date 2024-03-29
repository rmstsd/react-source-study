import React from './core/React'

function Foo() {
  console.log('Foo render')

  const [count, setCount] = React.useState(1)
  const [count2, setCount2] = React.useState(10)

  return (
    <div>
      <button
        onClick={() => {
          setCount(v => v + 1)
        }}
      >
        count {count}
      </button>
      <button
        onClick={() => {
          setCount2(v => v + 1)
        }}
      >
        count2 {count2}
      </button>
    </div>
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
      {/* <Bar /> */}
    </header>
  )
}

export default App
