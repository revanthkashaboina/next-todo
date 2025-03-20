import TodosList from "@/components/todos-list";
import CreateTodo from "@/components/create-todo";

export default function Home() {
  return (
    // flex flex-col
    <div className="max-w-7xl flex flex-col mx-auto p-10">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-4xl font-bold">Todos</h1>
        <CreateTodo />
      </div>
      <TodosList />
    </div>
  )
}