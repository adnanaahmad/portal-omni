module.exports = {
  siteMetadata: {
    title: "FortifID",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.inline\.svg$/,
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/static/images",
      },
    },
    "gatsby-plugin-catch-links",
    "gatsby-plugin-resolve-src",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-sass",
    },
  ],
}
