import {Octokit} from 'octokit';
import Image from 'next/image';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeTOC from '@jsdevtools/rehype-toc';
import rehypeSlug from 'rehype-slug';
import markdownMetadataParser from 'markdown-yaml-metadata-parser';
import Heading from 'next/head';

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
	const {metadata, content} = markdownMetadataParser(
		Buffer.from(post, encoding).toString()
	);

	return (
		<div>
			<Heading>
				<title>{metadata.title}</title>
				<meta key="title" name="title" content={metadata.title} />
				<meta
					key="description"
					name="description"
					content={metadata.description}
				/>
			</Heading>
			<h1>{metadata.title}</h1>
			<Markdown
				components={{
					img: ({src, alt}) => (
						<Image
							layout="responsive"
							width={400}
							height={300}
							objectFit="contain"
							referrerPolicy="no-referrer"
							src={src ?? ''}
							alt={alt ?? ''}
						/>
					),
				}}
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[
					rehypeRaw,
					rehypeSlug,
					rehypeTOC,
					rehypeHighlight,
				]}
			>
				{content}
			</Markdown>
		</div>
	);
};

export default Post;
