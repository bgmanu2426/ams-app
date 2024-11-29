/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import {
    useToast
} from "@/hooks/use-toast"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    PasswordInput
} from "@/components/ui/password-input"
import axios from 'axios';


const RegisterPage = () => {
    const { toast } = useToast();

    const formSchema = z.object({
        name: z.string().min(3),
        email: z.string(),
        password: z.string().min(3).max(10),
        usn: z.string().max(10)
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            const response = await axios.post('/api/register', data);
            toast({
                title: 'Success',
                description: response.data.message,
                variant: 'default',
            });
        } catch (error:any) {
            toast({
                title: 'Sign Up Failed',
                description: error.response.data.message,
                variant: 'destructive',
            });
        }
    }

    return (
        <div className="m-8 flex flex-col items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="your name"

                                        type="text"
                                        {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="example@test.com"

                                        type="email"
                                        {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput placeholder="*********" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="usn"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>USN</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="1XX20XX000"
                                        type="text"
                                        {...field}
                                        onChange={(e) => {
                                            const upperCaseValue = e.target.value.toUpperCase();
                                            field.onChange(upperCaseValue);
                                        }}
                                        />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Register</Button>
                </form>
            </Form>
        </div>
    )
}

export default RegisterPage;