import { useEffect, useState, useCallback } from 'react'
import { useApp } from '../contexts/AppContext'
import { subscribeItems, addItem, updateItem, removeItem } from '../data'

function useItems(kind) {
  const { user } = useApp()
  const [items, setItems] = useState([])
  const uid = user?.uid || 'guest'

  useEffect(() => {
    return subscribeItems(kind, uid, setItems)
  }, [kind, uid])

  const refresh = useCallback(() => {
    subscribeItems(kind, uid, (d) => setItems(d))
  }, [kind, uid])

  return { items, setItems, refresh, uid }
}

export default function Dashboard() {
  const { t, user } = useApp()
  const [tab, setTab] = useState('todos')
  const { items: todos, setItems: setTodos, refresh: refreshTodos, uid } = useItems('todos')
  const { items: notes, setItems: setNotes, refresh: refreshNotes } = useItems('notes')
  const [todoText, setTodoText] = useState('')

  const toggleTodo = async (todo) => {
    await updateItem('todos', uid, todo.id, { done: !todo.done })
    setTodos(todos.map((x) => (x.id === todo.id ? { ...x, done: !x.done } : x)))
  }

  const deleteTodo = async (id) => {
    await removeItem('todos', uid, id)
    setTodos(todos.filter((x) => x.id !== id))
  }

  const addTodo = async () => {
    if (!todoText.trim()) return
    await addItem('todos', uid, { text: todoText.trim(), done: false })
    setTodoText('')
    refreshTodos()
  }

  const remaining = todos.filter((t) => !t.done).length

  return (
    <section className="section" style={{ paddingTop: 130, minHeight: '75vh' }}>
      <div className="container">
        <div className="dash-header">
          <div>
            <h2>📊 {t('dash.title')}</h2>
            <p style={{ color: 'var(--text-dim)', marginTop: 6, fontSize: 14 }}>
              {t('dash.welcome')}, {user?.displayName?.split(' ')[0] || user?.email || 'Guest'}! 👋
            </p>
          </div>
          <div className="tabs">
            <button className={`tab ${tab === 'todos' ? 'active' : ''}`} onClick={() => setTab('todos')}>
              ✅ {t('dash.todos')}
            </button>
            <button className={`tab ${tab === 'notes' ? 'active' : ''}`} onClick={() => setTab('notes')}>
              📝 {t('dash.notes')}
            </button>
          </div>
        </div>

        {tab === 'todos' ? (
          <TodosView
            todos={todos}
            todoText={todoText}
            setTodoText={setTodoText}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            remaining={remaining}
            t={t}
          />
        ) : (
          <NotesView notes={notes} setNotes={setNotes} refreshNotes={refreshNotes} uid={uid} t={t} />
        )}
      </div>
    </section>
  )
}

function TodosView({ todos, todoText, setTodoText, addTodo, toggleTodo, deleteTodo, remaining, t }) {
  return (
    <div>
      <div className="add-row">
        <input
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder={t('dash.todoPlaceholder')}
        />
        <button className="btn btn-primary" onClick={addTodo}>
          {t('dash.add')}
        </button>
      </div>
      {remaining > 0 && (
        <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 14 }}>
          {t('dash.countTodos')(remaining)}
        </p>
      )}
      {todos.length === 0 ? (
        <div className="card empty-state">
          <div className="big">📋</div>
          {t('dash.emptyTodos')}
        </div>
      ) : (
        todos.map((todo) => (
          <div key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
            <button className={`todo-check ${todo.done ? 'checked' : ''}`} onClick={() => toggleTodo(todo)}>
              ✓
            </button>
            <span className="todo-text">{todo.text}</span>
            <button className="btn-icon todo-del" title={t('dash.delete')} onClick={() => deleteTodo(todo.id)}>
              🗑️
            </button>
          </div>
        ))
      )}
    </div>
  )
}

function NotesView({ notes, setNotes, refreshNotes, uid, t }) {
  const [drafts, setDrafts] = useState({})

  const addNote = async () => {
    await addItem('notes', uid, { text: '', updatedAt: Date.now() })
    refreshNotes()
  }

  const saveNote = async (note) => {
    const text = (drafts[note.id] ?? note.text ?? '').trim()
    if (!text) return
    await updateItem('notes', uid, note.id, { text, updatedAt: Date.now() })
    setNotes(notes.map((n) => (n.id === note.id ? { ...n, text } : n)))
  }

  const deleteNote = async (id) => {
    await removeItem('notes', uid, id)
    setNotes(notes.filter((n) => n.id !== id))
  }

  const timeLabel = (ts) => {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      <button className="new-note-btn" style={{ width: '100%', marginBottom: 20 }} onClick={addNote}>
        {t('dash.newNote')}
      </button>
      {notes.length === 0 ? (
        <div className="card empty-state">
          <div className="big">📝</div>
          {t('dash.emptyNotes')}
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {notes.map((note) => (
            <div key={note.id} className="card note-card">
              <div className="note-time">🕒 {timeLabel(note.updatedAt || note.createdAt)}</div>
              <textarea
                value={drafts[note.id] ?? note.text ?? ''}
                onChange={(e) => setDrafts({ ...drafts, [note.id]: e.target.value })}
                placeholder={t('dash.notePlaceholder')}
              />
              <div className="note-actions">
                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => saveNote(note)}>
                  {t('dash.save')}
                </button>
                <button className="btn btn-danger" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => deleteNote(note.id)}>
                  {t('dash.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
