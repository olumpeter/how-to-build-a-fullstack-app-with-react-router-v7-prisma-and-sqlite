import prisma from "~/lib/prisma"

import type { Route } from "./+types/home"

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ]
}

export async function loader({}: Route.LoaderArgs) {
    const users = await prisma.user.findMany()

    return { users }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const { users } = loaderData

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center -mt-16">
                <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)]">
                    Superblog
                </h1>
                <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
                    {users.map((user) => (
                        <li key={user.id} className="mb-2">
                            {user.name}
                        </li>
                    ))}
                </ol>
            </div>
        </>
    )
}
