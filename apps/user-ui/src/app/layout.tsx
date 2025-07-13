import { Header } from '../shared/widgets';
import './global.css';
import { Poppins , Roboto } from 'next/font/google';
import Providers from './providers';

export const metadata = {
  title: 'Swift Kart',
  description: 'Swift Kart is a platform for buying and selling products',
}

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable}`}>
        <Providers>
        <Header />
        {children}
        </Providers>
        </body>
    </html>
  )
}
