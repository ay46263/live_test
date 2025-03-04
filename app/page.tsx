import TodoApp from "@/components/todo-app"
import StickyNotesContainer from "@/components/sticky-notes-container"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 relative overflow-hidden">
      <StickyNotesContainer />
      <div className="flex items-center justify-center min-h-screen">
        <TodoApp />
      </div>
    </main>
  )
}

