"use client"

import { useState, useEffect } from "react"
import StickyNote from "./sticky-note"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export type StickyNoteType = {
  id: string
  content: string
  position: { x: number; y: number }
  color: string
}

const COLORS = ["bg-yellow-200", "bg-blue-200", "bg-green-200", "bg-pink-200", "bg-purple-200", "bg-orange-200"]

export default function StickyNotesContainer() {
  // Initialize state with data from localStorage if available
  const [notes, setNotes] = useState<StickyNoteType[]>(() => {
    if (typeof window !== "undefined") {
      const savedNotes = localStorage.getItem("stickyNotes")
      return savedNotes ? JSON.parse(savedNotes) : []
    }
    return []
  })

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("stickyNotes", JSON.stringify(notes))
  }, [notes])

  // Add a new sticky note
  const addNote = () => {
    // Generate random position within viewport bounds
    const x = Math.random() * (window.innerWidth - 200) // 200px is approx width of note
    const y = Math.random() * (window.innerHeight - 200) // 200px is approx height of note

    // Ensure note is not positioned over the todo app (center of screen)
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const safeX = x > centerX - 250 && x < centerX + 50 ? centerX + 250 : x

    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]

    const newNote: StickyNoteType = {
      id: crypto.randomUUID(),
      content: "",
      position: { x: safeX, y },
      color: randomColor,
    }

    setNotes([...notes, newNote])
  }

  // Update a note's content
  const updateNoteContent = (id: string, content: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, content } : note)))
  }

  // Update a note's position
  const updateNotePosition = (id: string, position: { x: number; y: number }) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, position } : note)))
  }

  // Delete a note
  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          onContentChange={updateNoteContent}
          onPositionChange={updateNotePosition}
          onDelete={deleteNote}
        />
      ))}

      <div className="fixed bottom-6 right-6 pointer-events-auto">
        <Button onClick={addNote} className="rounded-full h-14 w-14 shadow-lg" size="icon">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add sticky note</span>
        </Button>
      </div>
    </div>
  )
}

