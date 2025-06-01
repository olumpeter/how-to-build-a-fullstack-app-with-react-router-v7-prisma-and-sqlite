import {
    createCookieSessionStorage,
    data,
    redirect,
} from "react-router"

import { prisma } from "./prisma.server"
import { createUser } from "./user.server"

import type { LoginForm, RegisterForm } from "./types.server"
import bcrypt from "bcryptjs"

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set")
}

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "kudos-session",
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
})

export async function createUserSession(
    userId: number,
    redirectTo: string
) {
    const userSession = await sessionStorage.getSession()
    userSession.set("userId", userId)

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(
                userSession
            ),
        },
    })
}

export async function register(user: RegisterForm) {
    const userExists = Boolean(
        await prisma.user.count({
            where: {
                email: user.email,
            },
        })
    )
    if (userExists) {
        return data(
            { error: "User already exists with that email" },
            { status: 400 }
        )
    }

    const newUser = await createUser(user)

    if (!newUser) {
        return data(
            {
                error: "Something went wrong trying to create a new user.",
                user,
            },
            { status: 400 }
        )
    }

    return createUserSession(newUser.id, "/")
}

export async function login({ email, password }: LoginForm) {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
        include: { password: true },
    })

    if (
        !user ||
        !(await bcrypt.compare(
            password,
            user.password?.passwordHash as string
        ))
    ) {
        return data({ error: "Incorrect login" }, { status: 400 })
    }

    return createUserSession(user.id, "/")
}

export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
) {
    const userSession = await getUserSession(request)
    const userId = userSession.get("userId")
    if (!userId || typeof userId !== "number") {
        const searchParams = new URLSearchParams({
            redirectTo: redirectTo,
        })
        throw redirect(`/login?${searchParams}`)
    }
    return userId
}

export async function getUserSession(request: Request) {
    return sessionStorage.getSession(request.headers.get("Cookie"))
}

export async function getUserId(request: Request) {
    const userSession = await getUserSession(request)
    const userId = userSession.get("userId")
    if (!userId || typeof userId !== "number") return null
    return userId
}

export async function getUser(request: Request) {
    const userId = await getUserId(request)
    if (!userId || typeof userId !== "number") return null

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, profile: true },
        })
        return user
    } catch {
        throw logout(request)
    }
}

export async function logout(request: Request) {
    const userSession = await getUserSession(request)
    return redirect("/login", {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(
                userSession
            ),
        },
    })
}
