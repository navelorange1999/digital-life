/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: `https://${process.env.HOST}`,
	generateRobotsTxt: true, // (optional)
	output: 'export',
	outDir: 'public',
};
