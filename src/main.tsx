import ReactDom from './react-dom.development'
import React from './react.development'

// ReactDom.render(<App />, document.querySelector('#root'))

const root = ReactDom.createRoot(document.querySelector('#root'))

const cc = <RR_App />

root.render(cc)

const divEle = (
  <div className="main-dev" key="mm-dd">
    main
  </div>
)

console.log(divEle)

function RR_App() {
  console.log('app render')

  const [count, setCount] = React.useState(12)
  const [countss, setCountsdsd] = React.useState(66)

  countss
  setCountsdsd

  return (
    <main>
      {divEle}

      <button
        onClick={() => {
          setCount(13)
        }}
      >
        {count}
      </button>
    </main>
  )
}

function Child() {
  return <span>child</span>
}
