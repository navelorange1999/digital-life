declare namespace NodeJS {
	interface ProcessEnv {
		GITHUB_TOKEN: string;
		NEXT_PUBLIC_POSTHOG_KEY: string;
		REPO_OWNER: string;
		BLOG_REPO: string;
		BLOG_ROOT: string;
		NEXT_PUBLIC_POSTHOG_HOST: string;
	}
}
