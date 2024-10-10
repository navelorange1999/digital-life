import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'navelorange1999 blog',
	description: 'navelorange1999 blog',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
