import type {GetStaticProps} from 'next';
import {useRouter} from 'next/router';
import {Octokit} from 'octokit';

type BlogDirectory = Array<{
	name: string;
	path: string;
	count: number;
}>;

export const getStaticProps = (async () => {
	const octokit = new Octokit({
		auth: process.env.GITHUB_TOKEN,
	});

	const result = await octokit.rest.repos.getContent({
		owner: process.env.REPO_OWNER,
		repo: process.env.BLOG_REPO,
		path: process.env.BLOG_ROOT,
	});

	console.log('result', result);

	const directory: BlogDirectory = Array.isArray(result?.data)
		? (result?.data?.map((item) => ({
				name: item.name,
				path: item.path,
				count: 0,
			})) ?? [])
		: [];

	return {props: {directory}};
}) satisfies GetStaticProps<{
	directory: BlogDirectory;
}>;

export default function Home({directory}: {directory: BlogDirectory}) {
	const router = useRouter();

	return (
		<ul>
			{directory.map((item) => (
				<li key={item.path}>
					{item.name} - {router.query.slug} ({item.count})
				</li>
			))}
		</ul>
	);
}
