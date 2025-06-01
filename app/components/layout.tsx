import * as React from "react"

type LayoutProps = { children: React.ReactNode }

export function Layout({ children }: LayoutProps) {
    return (
        <>
            <div className="h-screen w-full bg-blue-600 font-mono">
                {children}
            </div>
        </>
    )
}
