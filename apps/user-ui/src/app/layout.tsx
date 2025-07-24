import { Header } from '../shared/widgets';
import './global.css';
import { Jost, Oregano, Poppins , Roboto } from 'next/font/google';
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

const oregano = Oregano({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-oregano',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-jost',
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable} ${oregano.variable} ${jost.variable}`}>
        <Providers>
        <Header />
        {children}
        </Providers>
        </body>
    </html>
  )
}
