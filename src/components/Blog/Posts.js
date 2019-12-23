import React from "react";
import PropTypes from "prop-types";
import Item from "./Item";
import { graphql } from "gatsby";

class Posts extends React.Component{

  render() {
    const {posts, theme} = this.props;

    return (
      <React.Fragment>
        <ul id = "posts">
          {posts.map(post => {
            const {
              node,
              node: {
                fields: { slug }
              }
            } = post;
            return <Item key={slug} post={node} theme={theme} />;
          })}
        </ul>
        {/* --- STYLES --- */}
        <style jsx>{`
        .main {
           padding: 0 ${theme.space.inset.default};
           display: grid;
           justify-content: center;
        }

        #posts {
          grid-row: 1;
          grid-column: 1;
        }

        ul {
          list-style: none;
          margin: 0 auto;
          padding: ${`calc(${theme.space.default} * 1.5) 0 calc(${theme.space.default} * 0.5)`};
        }

        @above tablet {
          .main {
            padding: 0 ${`0 calc(${theme.space.default} * 1.5)`};
          }
          ul {
            max-width: ${theme.text.maxWidth.tablet};
          }
        }
        @above desktop {
          ul {
            max-width: ${theme.text.maxWidth.desktop};
          }
        }
      `}</style>
      </React.Fragment>
    );
  }
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired
};

export default Posts;

export const PostListQuery = graphql`
 query PostListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//posts/[0-9]+.*--/" } }
      sort: { fields: [fields___prefix], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            prefix
          }
          frontmatter {
            title
            category
            author
            tags
          }
        }
      }
    }
   }
`;
