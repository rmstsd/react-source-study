import ReactDom from './react-dom.development'
import React from './react.development'

// ReactDom.render(<App />, document.querySelector('#root'))

const root = ReactDom.createRoot(document.querySelector('#root'))

const cc = <RR_App />

root.render(cc)

function RR_App() {
  console.log('app render')

  const [count, setCount] = React.useState(12)
  const [isPending, startTransition] = React.useTransition()

  const [list, setList] = React.useState([1, 2, 3])

  return (
    <main>
      <div className="main-dev" key="mm-dd">
        {'mm'} {'mm'}
      </div>

      <footer></footer>
    </main>
  )
}

function Child({ text }) {
  sleep(3)

  return <span>{text}</span>
}

export function sleep(ms: number) {
  let t = Date.now()
  while (Date.now() - t < ms) {}
}
