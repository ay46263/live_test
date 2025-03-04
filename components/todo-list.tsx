import type { Todo } from "./todo-app"
import { TodoItem } from "./todo-item"

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  // Sort todos: incomplete first, then by creation date (newest first)
  const sortedTodos = [...todos].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    // Then sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  if (todos.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Your task list is empty</div>
  }

  return (
    <ul className="space-y-2">
      {sortedTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}

