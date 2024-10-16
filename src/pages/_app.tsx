import type {AppProps} from 'next/app';

import 'highlight.js/styles/github-dark.css';

export default function RootApp({Component, pageProps}: AppProps) {
	return <Component {...pageProps} />;
}
