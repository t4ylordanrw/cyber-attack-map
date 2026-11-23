import './globals.css'

export const metadata = {
  title: 'Global Cyber Attack Map',
  description: 'Interactive map of the latest reported cyber attacks, categorized by Financial, Private Organisation, and Critical Infrastructure. Updated based on daily news checks.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  )
}
