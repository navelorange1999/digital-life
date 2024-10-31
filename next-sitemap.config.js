/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: `https://${process.env.HOST}`,
	generateRobotsTxt: true, // (optional)
	generateIndexSitemap: false,
	outDir: 'dist',
};
