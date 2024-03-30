import React from './core/React'

function Foo() {
  console.log('Foo render')

  const [count, setCount] = React.useState(1)

  React.useEffect(() => {
    console.log('first')
  }, [])

  // React.useEffect(() => {
  //   console.log('count update 1', count)
  // }, [count])

  // React.useEffect(() => {
  //   console.log('count update 2', count)
  // }, [count])

  return (
    <div>
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        count {count}
      </button>
    </div>
  )
}

function App() {
  console.log('App render')

  React.useEffect(() => {
    console.log('app first')
  }, [])

  return (
    <header id="app">
      <hr />

      <Foo />
    </header>
  )
}

export default App
