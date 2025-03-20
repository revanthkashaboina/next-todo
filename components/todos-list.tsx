"use client"

import { Todo } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import useSWR from "swr";
// import { Button } from "./ui/button";
// import { Delete, TrashIcon } from "lucide-react";
import DeleteTodo from "./delete-todo";
import UpdateTodo from "./update-todo";

const fetcher = (url:string) =>fetch(url).then((res)=>res.json());

export default function TodosList(){
    // const [todos, setTodos] = useState<Todo[]>([])
    const {data: todos, isLoading, error} = useSWR<Todo[]>('/api/todos', fetcher);

    if(isLoading){
        return(
            <div className="flex justify-center items-center h-40 bg-white">
                <div className="relative w-12 h-12">
                    <div className="absolute w-12 h-12 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
                    <div className="absolute w-12 h-12 border-4 border-primary rounded-full animate-ping opacity-25"></div>
                </div>
            </div>
        )
    }

    if(error) return <div>Failed to load todos</div>

    const todoList = todos || [];

    return(
        <div className="space-y-4">
            {todoList.length === 0 ?(
                <Card>
                    <CardContent className="text-center py-10">
                        <p className="text-muted-foreground">All done for today!!</p>
                    </CardContent>
                </Card>
            ):(
                todoList.map((todo)=>(
                    <Card className="group relative" key={todo.id}>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* <Button variant='ghost' size='icon' className="cursor-pointer text-red-500 bg-red-100 hover:text-red-700 hover:bg-red-200">
                                <TrashIcon className="w-4 h-4" />
                            </Button> */}
                            <UpdateTodo todo={todo} />
                            <DeleteTodo id={todo.id} />
                        </div>
                        <CardHeader>
                            <CardTitle>
                                <span className={todo.isCompleted ? "line-through" : ""}>{todo.title}</span>
                            </CardTitle>
                        </CardHeader>
                        {todo.description && (
                            <CardContent>
                                <p>{todo.description}</p>
                            </CardContent>
                        )}

                        {/* {
                            todo.createdAt && (
                                <CardContent>
                                    <p>Created at: {todo.createdAt}</p>
                                </CardContent>
                            )
                        } */}
                    </Card>
                ))
            )}
        </div>
    )
}