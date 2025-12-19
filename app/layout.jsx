import '@fontsource/inter';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

export const metadata = {
  title: 'Weather App',
  description: 'Real-time weather forecast application built with Next.js',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Weather App</title>
      </head>
      <body style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}>
        {children}
      </body>
    </html>
  );
}
