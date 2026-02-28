export default function Layout({ children }) {
  return (
    <main className="min-h-screen px-6 md:px-12 lg:px-20 py-10 bg-white dark:bg-gray-950 transition-colors duration-300">
      {children}
    </main>
  )
}