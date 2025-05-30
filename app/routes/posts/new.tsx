import { Form, redirect } from "react-router"
import prisma from "~/lib/prisma"

import type { Route } from "./+types/new"

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    try {
        await prisma.post.create({
            data: {
                title,
                content,
                authorId: 1,
            },
        })
    } catch (error) {
        console.error(error)
        return Response.json(
            { error: "Failed to create post" },
            { status: 500 }
        )
    }

    return redirect("/posts")
}

export default function NewPost() {
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
                Create New Post
            </h1>
            <Form method="post" className="space-y-6">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-lg mb-2"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter your post title"
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label
                        htmlFor="content"
                        className="block text-lg mb-2"
                    >
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Write your post content here..."
                        rows={6}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                >
                    Create Post
                </button>
            </Form>
        </div>
    )
}
