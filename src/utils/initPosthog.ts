import {IS_SSG} from '@/constants/env';
import posthog from 'posthog-js';

export const initPosthog = () => {
	if (!IS_SSG) {
		// checks that we are client-side
		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
			api_host:
				process.env.NEXT_PUBLIC_POSTHOG_HOST ||
				'https://us.i.posthog.com',
			person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
			loaded: (posthog) => {
				if (process.env.NODE_ENV === 'development') posthog.debug(); // debug mode in development
			},
		});
	}
};
