import Navigation from "./components/Navigation"

export default function RootLayout({
    children
}) {
    return (
        <html>
            <body>
                <Navigation />
                {children}
            </body>
        </html>
    )
}