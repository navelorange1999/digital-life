import type {GetStaticProps} from 'next';

type BlogDirectory = Array<{
	name: string;
	path: string;
	count: number;
}>;

export const getStaticProps = (async () => {
	const data = await fetch(
		'https://api.github.com/repos/navelorange1999/blog-database/contents/markdowns'
	);
	const result = (await data.json()) as Array<{
		name: string;
		path: string;
	}>;

	const directory: BlogDirectory =
		result?.map((item) => ({
			name: item.name,
			path: item.path,
			count: 0,
		})) ?? [];

	return {props: {directory}};
}) satisfies GetStaticProps<{
	directory: BlogDirectory;
}>;

export default function Home({directory}: {directory: BlogDirectory}) {
	return (
		<ul>
			{directory.map((item) => (
				<li key={item.path}>
					{item.name} ({item.count})
				</li>
			))}
		</ul>
	);
}
