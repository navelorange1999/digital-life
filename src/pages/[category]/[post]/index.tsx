import {Octokit} from 'octokit';
import Markdown from 'react-markdown';

import {getBlogDirectory} from '@/utils/getBlogDirectory';

export const getStaticPaths = async () => {
	const categories = await getBlogDirectory();

	const postsGroup = await Promise.all(
		categories.map(async ({slug, databasePath}) => {
			const posts = await getBlogDirectory(databasePath);
			return {
				category: slug,
				posts,
			};
		})
	);

	const paths: Array<{
		params: {
			category: string;
			post: string;
		};
	}> = [];

	postsGroup.forEach(({category, posts}) => {
		posts.forEach(({slug}) => {
			paths.push({
				params: {
					category,
					post: slug,
				},
			});
		});
	});

	return {paths, fallback: false};
};

export const getStaticProps = async ({
	params,
}: {
	params: {
		category: string;
		post: string;
	};
}) => {
	const directoryPath = (await getBlogDirectory()).find(
		({slug}) => slug === params.category
	)?.databasePath;

	const databasePath = (await getBlogDirectory(directoryPath)).find(
		({slug}) => slug === params.post
	)?.databasePath;

	if (!databasePath) {
		return {
			props: null,
		};
	}

	const octokit = new Octokit({
		auth: process.env.GITHUB_TOKEN,
	});

	const result = await octokit.rest.repos.getContent({
		owner: process.env.REPO_OWNER,
		repo: process.env.BLOG_REPO,
		path: databasePath,
	});

	if (!Array.isArray(result.data)) {
		if (result.data.type === 'file') {
			return {
				props: {
					post: result.data.content,
					encoding: result.data.encoding,
				},
			};
		}
	}

	return {props: null};
};

const Post = ({post, encoding}: {post: string; encoding: BufferEncoding}) => {
	const markdown = Buffer.from(post, encoding).toString();

	return <Markdown>{markdown}</Markdown>;
};

export default Post;
