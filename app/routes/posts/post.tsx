import { data } from "react-router"
import prisma from "~/lib/prisma"

import type { Route } from "./+types/post"

export async function loader({ params }: Route.LoaderArgs) {
    const { postId } = params
    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(postId),
        },
        include: {
            author: true,
        },
    })

    if (!post) {
        throw data("Post Not Found", { status: 404 })
    }

    return { post }
}

export default function Post({ loaderData }: Route.ComponentProps) {
    const { post } = loaderData

    return (
        <div className="min-h-screen flex flex-col items-center justify-center -mt-16">
            <article className="max-w-2xl space-y-4 font-[family-name:var(--font-geist-sans)]">
                <h1 className="text-4xl font-bold mb-8">
                    {post.title}
                </h1>
                <p className="text-gray-600 text-center">
                    {post.author.name}
                </p>
                <div className="prose prose-gray mt-8">
                    {post.content || "No content available."}
                </div>
            </article>
        </div>
    )
}
