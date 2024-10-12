import {Octokit} from 'octokit';
import cache from 'memory-cache';

type Path = string;

const BlogDirectoryCache = new cache.Cache<Path, BlogDirectory>();

export type BlogDirectory = Array<{
	name: string;
	slug: string;
	databasePath: string;
	count: number;
}>;

export const getBlogDirectory = async (path = '') => {
	const cacheKey = path || 'root';

	const cached = BlogDirectoryCache.get(cacheKey);

	if (cached) {
		return cached;
	}

	const octokit = new Octokit({
		auth: process.env.GITHUB_TOKEN,
	});

	const result = await octokit.rest.repos.getContent({
		owner: process.env.REPO_OWNER,
		repo: process.env.BLOG_REPO,
		path: path || process.env.BLOG_ROOT,
	});

	const directory: BlogDirectory = Array.isArray(result?.data)
		? (result?.data?.map((item) => {
				const slug =
					item?.type === 'file' ? item.sha : item.name.toLowerCase();

				return {
					slug,
					name: item.name,
					databasePath: item.path,
					count: 0,
				};
			}) ?? [])
		: [];

	if (!cached) {
		BlogDirectoryCache.put(cacheKey, directory);
	}

	return directory;
};
