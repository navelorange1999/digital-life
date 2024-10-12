import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';

import {BlogDirectory, getBlogDirectory} from '@/utils/getBlogDirectory';

export const getStaticPaths = async () => {
	const categories = await getBlogDirectory();

	const paths = categories.map(({slug}) => {
		return {
			params: {
				category: slug,
			},
		};
	});

	return {paths, fallback: false};
};

export const getStaticProps = async ({
	params,
}: {
	params: {
		category: string;
	};
}) => {
	const categories = await getBlogDirectory();

	const databasePath = categories.find(
		({slug}) => slug === params.category
	)?.databasePath;

	if (!databasePath) {
		return {
			props: {
				posts: [],
			},
		};
	}

	const posts = await getBlogDirectory(databasePath);

	return {props: {posts}};
};

const Category = ({posts}: {posts: BlogDirectory}) => {
	const router = useRouter();

	return (
		<ul>
			{posts.map((item) => (
				<li key={item.slug}>
					<Link
						href={`/${router.query.category}/${encodeURIComponent(item.slug)}`}
					>
						{item.name}
					</Link>
				</li>
			))}
		</ul>
	);
};

export default Category;
