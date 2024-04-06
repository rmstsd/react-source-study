import React from './core/React'
const { useState, useEffect } = React

function App() {
  const [value, setValue] = useState('')
  const [list, setList] = useState<{ id: string; title: string; status: 'active' | 'done' }[]>([])

  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (localStorage.todos) {
      setList(localStorage.todos ? JSON.parse(localStorage.todos) : [])
    }
  }, [])

  function aaa() {
    if (localStorage.todos) {
      setList(localStorage.todos ? JSON.parse(localStorage.todos) : [])
    }
  }

  function saveTodo() {
    localStorage.todos = JSON.stringify(list)
  }

  const handleAdd = () => {
    addTodo(value)
    setValue('')
  }

  function createTodo(title: string) {
    return { id: crypto.randomUUID(), title, status: 'active' as const }
  }

  const addTodo = (title: string) => {
    setList(list.concat(createTodo(title)))
  }

  const removeTodo = (id: string) => {
    setList(list.filter(item => item.id !== id))
  }

  const doneTodo = (id: string) => {
    setList(list.map(item => (item.id === id ? { ...item, status: 'done' } : item)))
  }

  const cancelTodo = (id: string) => {
    setList(list.map(item => (item.id === id ? { ...item, status: 'active' } : item)))
  }

  return (
    <main>
      <div>
        <input type="text" value={value} onChange={evt => setValue(evt.target.value)} />
        <button onClick={handleAdd}>add</button>
      </div>

      <button onClick={saveTodo}>save</button>
      <button onClick={aaa}>aaa</button>

      <hr />

      <div>
        <input type="radio" name="filter" id="all" checked={filter === 'all'} onChange={() => setFilter('all')} />
        <label htmlFor="all">all</label>

        <input
          type="radio"
          name="filter"
          id="active"
          checked={filter === 'active'}
          onChange={() => setFilter('active')}
        />
        <label htmlFor="active">active</label>

        <input type="radio" name="filter" id="done" checked={filter === 'done'} onChange={() => setFilter('done')} />
        <label htmlFor="done">done</label>
      </div>

      <ul>
        {...list.map(item => (
          <TodoItem item={item} removeTodo={removeTodo} doneTodo={doneTodo} cancelTodo={cancelTodo} />
        ))}
      </ul>
    </main>
  )
}

function TodoItem({ item, removeTodo, doneTodo, cancelTodo }) {
  return (
    <li>
      <span className={item.status}>{item.title}</span>

      <button onClick={() => removeTodo(item.id)}>remove</button>

      {item.status === 'active' ? (
        <button onClick={() => doneTodo(item.id)}>done</button>
      ) : (
        <button onClick={() => cancelTodo(item.id)}>cancel</button>
      )}
    </li>
  )
}

export default App
