import bcrypt from "bcryptjs"
import { prisma } from "./prisma.server"

import type { RegisterForm } from "./types.server"

export async function createUser(user: RegisterForm) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const newUser = await prisma.user.create({
        data: {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            password: {
                create: {
                    passwordHash: passwordHash,
                },
            },
            profile: {
                create: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            },
        },
    })

    return { id: newUser.id, email: newUser.email }
}
