//const webpack = require("webpack");
const _ = require("lodash");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");
const Promise = require("bluebird");
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode });
    const fileNode = getNode(node.parent);
    const source = fileNode.sourceInstanceName;
    const separtorIndex = ~slug.indexOf("--") ? slug.indexOf("--") : 0;
    const shortSlugStart = separtorIndex ? separtorIndex + 2 : 0;

    if (source !== "parts") {
      createNodeField({
        node,
        name: `slug`,
        value: `${separtorIndex ? "/" : ""}${slug.substring(shortSlugStart)}`
      });
    }
    createNodeField({
      node,
      name: `prefix`,
      value: separtorIndex ? slug.substring(1, separtorIndex) : ""
    });
    createNodeField({
      node,
      name: `source`,
      value: source
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const postTemplate = path.resolve("./src/templates/PostTemplate.js");
  const pageTemplate = path.resolve("./src/templates/PageTemplate.js");
  const categoryTemplate = path.resolve("./src/templates/CategoryTemplate.js");
  const tagTemplate = path.resolve("./src/templates/TagTemplate.js");

  // Do not create draft post files in production.
  let activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || "development"
  console.log(`Using environment config: '${activeEnv}'`)
  let filters = `filter: { fields: { slug: { ne: null } } }`;
  if (activeEnv == "production") filters = `filter: { fields: { slug: { ne: null } , prefix: { ne: null } } }`

  return (
    graphql(`
          {
            allMarkdownRemark( ` + filters + `
              sort: { fields: [fields___prefix], order: DESC }
              limit: 2000
            ) {
              edges {
                node {
                  id
                  fields {
                    slug
                    prefix
                    source
                  }
                  frontmatter {
                    title
                    category
                    tags
                  }
                }
              }
            }
          }
        `).then(result => {
      if (result.errors) {
        return Promise.reject(result.errors)
      }

      const items = result.data.allMarkdownRemark.edges;

      // カテゴリ
      const categorySet = new Set();
      items.forEach(edge => {
        const {
          node: {
            frontmatter: { category }
          }
        } = edge;

        if (category && category !== null) {
          categorySet.add(category);
        }
      });

      // Create category pages
      const categoryList = Array.from(categorySet);
      categoryList.forEach(category => {
        createPage({
          path: `/category/${_.kebabCase(category)}/`,
          component: categoryTemplate,
          context: {
            category
          }
        });
      });

      //こいつにタグをぶちこむ
      let tags = [];

      // 全ポストのTagsを上の変数にぶちこむ
      _.each(items, edge => {
        if (_.get(edge, "node.frontmatter.tags")) {
          tags = tags.concat(edge.node.frontmatter.tags)
        }
      });

      //重複しているタグを消す
      tags = _.uniq(tags);

      // タグページを作る
      tags.forEach(tag => {
        createPage({
          path: `/tag/${_.kebabCase(tag)}/`,
          component: tagTemplate,
          context: {
            tag,
          },
        })
      });

      const posts = items.filter(item => item.node.fields.source === "posts");

      posts.forEach(({ node }, index) => {
        const slug = node.fields.slug;
        const next = index === 0 ? undefined : posts[index - 1].node;
        const prev = index === posts.length - 1 ? undefined : posts[index + 1].node;
        const source = node.fields.source;

        createPage({
          path: slug,
          component: postTemplate,
          context: {
            slug,
            prev,
            next,
            source
          }
        });
      });

      const pages = items.filter(item => item.node.fields.source === "pages");
      pages.forEach(({ node }) => {
        const slug = node.fields.slug;
        const source = node.fields.source;

        createPage({
          path: slug,
          component: pageTemplate,
          context: {
            slug,
            source
          }
        });
      });

      /*
      const searchJSON = posts.map(({ node }, index) => {
        const slug = node.fields.slug;
        const next = index === 0 ? undefined : posts[index - 1].node;
        const prev = index === posts.length - 1 ? undefined : posts[index + 1].node;
        const source = node.fields.source;

        return {
          path: slug,
          context: {
            slug,
            prev,
            next,
            source
          }
        }
      });

      fs.writeFileSync('./static/search.json', JSON.stringify(searchJSON, null , 2));
      */

    })
  );
};

exports.onCreateWebpackConfig = ({ stage, actions }, options) => {
  switch (stage) {
    case `build-javascript`:
      actions.setWebpackConfig({
        plugins: [
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "./report/treemap.html",
            openAnalyzer: true,
            logLevel: "error",
            defaultSizes: "gzip"
          })
        ]
      });
  }
};
