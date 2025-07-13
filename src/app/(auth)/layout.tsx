export const metadata = {
  title: 'AnonyMata',
  description: 'Welcome to the world of true feedbacks.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
