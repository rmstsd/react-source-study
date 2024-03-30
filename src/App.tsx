import React from './core/React'

function Foo() {
  console.log('Foo render')

  const [count, setCount] = React.useState(1)

  React.useEffect(() => {
    console.log('first')

    return () => {
      console.log('un mount')
    }
  }, [])

  React.useEffect(() => {
    console.log('count update', count)

    return () => {
      console.log('cleanup', count)
    }
  }, [count])

  React.useEffect(() => {
    console.log('count update', count)

    return () => {
      console.log('cleanup', count)
    }
  }, [count])

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

  const [bool, setBool] = React.useState(true)

  return (
    <header id="app">
      <button onClick={() => setBool(false)}>set false</button>

      {bool && <Foo />}
    </header>
  )
}

export default App
