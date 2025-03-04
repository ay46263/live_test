"use client"

import { useState, useEffect } from "react"
import { TodoForm } from "./todo-form"
import { TodoList } from "./todo-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

// Define the Todo type
export type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export default function TodoApp() {
  // Initialize state with data from localStorage if available
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const savedTodos = localStorage.getItem("todos")
      return savedTodos ? JSON.parse(savedTodos) : []
    }
    return []
  })

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  // Add a new todo
  const addTodo = (text: string) => {
    if (text.trim()) {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: new Date(),
      }
      setTodos([...todos, newTodo])
    }
  }

  // Toggle todo completion status
  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // Count completed and total todos
  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6" />
          <CardTitle>Task Manager</CardTitle>
        </div>
        <CardDescription className="text-primary-foreground/80">Keep track of your daily tasks</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <TodoForm onAddTodo={addTodo} />

        <div className="mt-6">
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {totalCount > 0 ? (
            <p>
              {completedCount} of {totalCount} task{totalCount !== 1 ? "s" : ""} completed
            </p>
          ) : (
            <p>No tasks yet. Add one above!</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

