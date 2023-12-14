"use client"

import { useState } from "react";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const LoginForm = ({ onSubmit }: { onSubmit: (username: string) => void }) => {
     const [username, setUsername] = useState("")

     const form = useForm()

     return (
          <Form {...form}>
               <form
                    onSubmit={(e) => {
                         e.preventDefault();
                         onSubmit(username);
                    }}
               >
                    <Input
                         type="text"
                         value={username}
                         placeholder="username"
                         onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button type="submit" className="w-full mt-[10px]">Login</Button>
               </form>
          </Form>
     );
}

export default LoginForm;