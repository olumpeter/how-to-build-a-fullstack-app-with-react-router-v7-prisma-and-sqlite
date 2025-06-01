import { prisma } from "~/utils/prisma.server"
import { requireUserId } from "~/utils/auth.server"

import type { Route } from "./+types/home"

export async function loader({ request }: Route.ActionArgs) {
    await requireUserId(request)
    const posts = await prisma.post.findMany({
        include: {
            author: true,
        },
    })
    return { posts }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const { posts } = loaderData

    return (
        <div className="min-h-screen flex flex-col items-center justify-center -mt-16">
            <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)]">
                Posts
            </h1>
            <ul className="font-[family-name:var(--font-geist-sans)] max-w-2xl space-y-4">
                {posts.map((post) => (
                    <li key={post.id}>
                        <span className="font-semibold">
                            {post.title}
                        </span>
                        <span className="text-sm text-gray-600 ml-2">
                            by {post.author.name}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
