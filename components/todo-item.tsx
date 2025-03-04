"use client"

import type { Todo } from "./todo-app"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li
      className={cn(
        "flex items-center justify-between p-3 rounded-lg transition-all",
        "bg-card border",
        todo.completed && "bg-muted/50",
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox id={`todo-${todo.id}`} checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} />
        <label
          htmlFor={`todo-${todo.id}`}
          className={cn(
            "text-sm font-medium cursor-pointer transition-all",
            todo.completed && "line-through text-muted-foreground",
          )}
        >
          {todo.text}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete task</span>
      </Button>
    </li>
  )
}

