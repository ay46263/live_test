"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { StickyNoteType } from "./sticky-notes-container"
import { cn } from "@/lib/utils"

interface StickyNoteProps {
  note: StickyNoteType
  onContentChange: (id: string, content: string) => void
  onPositionChange: (id: string, position: { x: number; y: number }) => void
  onDelete: (id: string) => void
}

export default function StickyNote({ note, onContentChange, onPositionChange, onDelete }: StickyNoteProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const noteRef = useRef<HTMLDivElement>(null)

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (noteRef.current && e.target === noteRef.current.querySelector(".drag-handle")) {
      setIsDragging(true)

      // Calculate the offset from the mouse position to the top-left corner of the note
      const rect = noteRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && noteRef.current) {
        // Calculate new position based on mouse position and offset
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        // Update position in the DOM for smooth dragging
        noteRef.current.style.left = `${newX}px`
        noteRef.current.style.top = `${newY}px`
      }
    },
    [isDragging, dragOffset],
  )

  // Handle mouse up to end dragging and save position
  const handleMouseUp = useCallback(() => {
    if (isDragging && noteRef.current) {
      setIsDragging(false)

      // Get the final position from the DOM
      const rect = noteRef.current.getBoundingClientRect()
      onPositionChange(note.id, { x: rect.left, y: rect.top })
    }
  }, [isDragging, note.id, onPositionChange])

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={noteRef}
      className={cn(
        "absolute pointer-events-auto",
        "w-56 shadow-md rounded-md overflow-hidden",
        "flex flex-col",
        note.color,
        isDragging && "opacity-80 shadow-lg",
      )}
      style={{
        left: `${note.position.x}px`,
        top: `${note.position.y}px`,
        zIndex: isDragging ? 100 : 10,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="drag-handle h-6 cursor-move flex items-center justify-between px-2 bg-black/10"
        onMouseDown={handleMouseDown}
      >
        <div className="w-4 h-4">
          <svg viewBox="0 0 20 20" className="w-4 h-4 text-black/40">
            <path
              fill="currentColor"
              d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
            />
          </svg>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 rounded-full hover:bg-black/10"
          onClick={() => onDelete(note.id)}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Delete note</span>
        </Button>
      </div>

      <Textarea
        value={note.content}
        onChange={(e) => onContentChange(note.id, e.target.value)}
        placeholder="Type your note here..."
        className={cn(
          "resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0",
          "bg-transparent min-h-[120px] p-3 text-sm",
          "placeholder:text-black/30",
        )}
      />
    </div>
  )
}

