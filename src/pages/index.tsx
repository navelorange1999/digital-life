import type {GetStaticProps} from 'next';
import Link from 'next/link';

import {BlogDirectory, getBlogDirectory} from '@/utils/getBlogDirectory';

export const getStaticProps = (async () => {
	const directory = await getBlogDirectory();

	return {props: {directory}};
}) satisfies GetStaticProps<{
	directory: BlogDirectory;
}>;

export default function Home({directory}: {directory: BlogDirectory}) {
	return (
		<div>
			<ul>
				{directory.map((item) => (
					<li key={item.slug}>
						<Link href={`/${encodeURIComponent(item.slug)}`}>
							{item.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
