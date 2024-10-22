import posthog from 'posthog-js';
import {PostHogProvider} from 'posthog-js/react';
import type {AppProps} from 'next/app';

import 'highlight.js/styles/github-dark.css';
import {initPosthog} from '@/utils/initPosthog';

export default function RootApp({Component, pageProps}: AppProps) {
	// Initialize PostHog
	initPosthog();

	return (
		<PostHogProvider client={posthog}>
			<Component {...pageProps} />
		</PostHogProvider>
	);
}
