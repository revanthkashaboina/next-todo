"use client"

import { Button } from "./ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { todoSchema, type TodoSchema } from "@/lib/zod";
import { useState } from "react";
import { mutate } from "swr";
import TodoForm from "./todo-form";

export default function CreateTodo(){

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<TodoSchema>({
        resolver: zodResolver(todoSchema),
        defaultValues:{
            title:"",
            description:"",
            isCompleted:false
        }
    })


    const onSubmit = async(data: TodoSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/todos", {
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })

            const responseData = await response.json();

            if(!response.ok){
                throw new Error(responseData.message || "Failed to create todo");
            }

            form.reset();
            setErrorMessage("");
            setIsDialogOpen(false);
            mutate("/api/todos");
        } catch (error) {
            console.log("Error creating todo:", error);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occured";
            setErrorMessage(errorMessage);
        }finally{
            setIsSubmitting(false);
        }
    }


    return(
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Add Todo</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Create Todo</DialogTitle>
                </DialogHeader>

                {errorMessage && (
                        <div className="text-red-500 text-sm mb-4">
                            {errorMessage}
                        </div>
                )}

                {/* <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> 
                        <FormField control={form.control}
                        name="title" render={({field})=>(
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                        </FormField>

                        <FormField control={form.control} name="description" render={({field})=>(
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea className="resize-none" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                        </FormField>


                        <FormField control={form.control} name="isCompleted" render={({field})=>(
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Mark as Completed</FormLabel>
                                </div>
                            </FormItem>
                        )}>
                        </FormField>

                        <Button className="cursor-pointer w-full" type="submit" disabled={isSubmitting}>Create Todo</Button>
                    </form>
                </Form> */}

                <TodoForm defaultValues={{title:"", description:"", isCompleted:false}} onSubmit={onSubmit} submitButtonText="Create" isSubmitting={isSubmitting} />
            </DialogContent>
        </Dialog>
    )
}