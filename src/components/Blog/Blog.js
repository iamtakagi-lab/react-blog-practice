import PropTypes from "prop-types";
import React from "react";

import Item from "../Blog/Item";

const Blog = (props) => {
  const {theme, posts} = props;

  return (
    <React.Fragment>
      <main className="main">
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
      </main>
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


        #popular-posts {
          grid-row: 1;
          grid-column: 2;
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
};


Blog.propTypes = {
  posts: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  pathContext: PropTypes.object.isRequired
};


export default Blog;
