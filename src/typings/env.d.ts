declare namespace NodeJS {
	interface ProcessEnv {
		GITHUB_TOKEN: string;
		REPO_OWNER: string;
		BLOG_REPO: string;
		BLOG_ROOT: string;
	}
}
