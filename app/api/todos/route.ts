import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";


export async function GET(){
    try{
        const todos = await prisma.todo.findMany({
            orderBy:{
                createdAt: "desc"
            }
        });

        return NextResponse.json(todos);
    }catch(error){
        console.error("Error fetching todos:", error)
        return NextResponse.json({message: 'An unexpected error occured'}, {status: 500})
    }
}


export async function POST(req: NextRequest) {
    try {
        const newTodo = await req.json();
        const todo = await prisma.todo.create({
            data:{
                title: newTodo.title,
                description: newTodo.description,
                isCompleted: newTodo.isCompleted
            }
        })

        // console.log("Todo created:===============", todo); 
        return NextResponse.json(todo);
    } catch (error) {
        console.error("Error creating todo:", error)
    }
}


export async function DELETE(request:NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get("id") ?? undefined;
        // console.log("id:========================", id)
        const deleteTodo = await prisma.todo.delete({
            where:{
                id
            }
        })

        if(!deleteTodo){
            return NextResponse.json({message: 'Todo not found'}, {status: 404})}

        return NextResponse.json({message: 'Todo deleted successfully'}, {status: 200});
    } catch (error) {
        console.error("Error deleting todo:", error)
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, title, description, isCompleted } = await req.json();
        
        if (!id) {
            return NextResponse.json({ message: "Todo ID is required" }, { status: 400 });
        }

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: { title, description, isCompleted }
        });

        return NextResponse.json(updatedTodo);
    } catch (error) {
        console.error("Error updating todo:", error);
        return NextResponse.json({ message: "Failed to update todo" }, { status: 500 });
    }
}