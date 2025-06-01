import { useState } from "react"
import { data, Form, Link } from "react-router"
import { FormField } from "~/components/formField"
import { Layout } from "~/components/layout"

import {
    validateEmail,
    validateName,
    validatePassword,
} from "~/utils/validators.server"
import { register } from "~/utils/auth.server"

import type { Route } from "./+types/signup"

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")
    const firstName = formData.get("firstName")
    const lastName = formData.get("lastName")

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof firstName !== "string" ||
        typeof lastName !== "string"
    ) {
        return data({ error: "Invalid Form Data" }, { status: 400 })
    }

    const errors = {
        email: validateEmail(email),
        password: validatePassword(password),
        firstName: validateName(password),
        lastName: validateName(password),
    }

    if (Object.values(errors).some(Boolean)) {
        return data(
            {
                errors,
                fields: { email, password, firstName, lastName },
            },
            { status: 400 }
        )
    }

    return await register({ email, password, firstName, lastName })
}

export default function signUp() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    })

    return (
        <>
            <Layout>
                <div className="h-full flex flex-col justify-center items-center gap-y-4">
                    <Link to="/login">
                        <button className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1">
                            Sign In
                        </button>
                    </Link>
                    <h2 className="text-5xl font-extrabold text-yellow-300">
                        Welcome to Kudos!
                    </h2>
                    <p className="font-semibold text-slate-300">
                        Sign Up To Get Started!
                    </p>

                    <Form
                        method="post"
                        className="rounded-2xl bg-gray-200 p-6 w-96"
                    >
                        <FormField
                            htmlFor="email"
                            label="Email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }}
                        />
                        <FormField
                            htmlFor="password"
                            type="password"
                            label="Password"
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }}
                        />
                        <FormField
                            htmlFor="firstName"
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    firstName: e.target.value,
                                })
                            }}
                        />
                        <FormField
                            htmlFor="lastName"
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    lastName: e.target.value,
                                })
                            }}
                        />

                        <div className="w-full text-center">
                            <button
                                type="submit"
                                className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                            >
                                Sign Up
                            </button>
                        </div>
                    </Form>
                </div>
            </Layout>
        </>
    )
}
