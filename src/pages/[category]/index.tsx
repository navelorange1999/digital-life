import React from 'react';
import Link from 'next/link';
import Heading from 'next/head';
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

	return {props: {category: params.category, posts}};
};

const Category = ({posts}: {posts: BlogDirectory}) => {
	const router = useRouter();

	const category = router.query.category as string;

	// first letter to uppercase
	const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

	return (
		<div>
			<Heading>
				<title>{`${categoryTitle} | Blog - navelorange1999`}</title>
				<meta name="keywords" content={category} />
				<meta
					name="title"
					content={`${categoryTitle} | Blog - navelorange1999`}
				/>
				<meta
					name="description"
					content={`navelorange1999's posts on ${categoryTitle}`}
				/>
			</Heading>
			<ul>
				{posts.map((item) => (
					<li key={item.slug}>
						<Link
							href={`/${category}/${encodeURIComponent(item.slug)}`}
						>
							{item.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Category;
