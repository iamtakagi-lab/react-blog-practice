import { FaArrowRight, FaCalendar, FaTag, FaUser } from "react-icons/fa/";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

const style = {
  tagbtn: {
    position: "relative",
    display: "block",
    width: "93px",
    height: "24px",
    lineHeight: "24px",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    backgroundColor: "#4f4f4f",
    borderRadius: "5px",
    webkitTransition: "all 0.5s",
    transition: "all 0.5s",
    webkitUserSelect: "none",
    msUserSelect: "none",
    margin: "5px"
  }
};

const Item = (props) => {
  const {
    theme,
    post: {
      excerpt,
      fields: { slug, prefix },
      frontmatter: {
        title,
        category,
        author,
        tags
      }
    }
  } = props;

  const getTags = (tags) => {
    if (tags != null) {
      const toReturn = [];
      tags.forEach((tag) => {
        toReturn.push(tag)
      });
      return toReturn;
    }
  };

  const getTagElements = getTags(tags).map((a) =>
    <Link to={`/tag/${a.split(" ").join("-").toLowerCase()}`}>
      <span className="tag-button" style={style.tagbtn}>#{a}</span>
    </Link>
  );

  return (
    <React.Fragment>
      <li>

        <Link to={slug} key={slug} className="link">
          <h1>
            {title}
          </h1>
        </Link>

        <p className="meta">

          {category && (
            <Link to={`/category/${category.split(" ").join("-").toLowerCase()}`}>
              <span className="category-button">
                {category}
              </span>
            </Link>)}

          <span>
              <FaCalendar size={18} /> {prefix}
          </span>

          <span>
              <FaUser size={18} /> {author}
          </span>

        </p>

        <p>{excerpt}</p>

        <p className={"tags"}>
          <span>タグ: </span>
          {getTagElements}
        </p>
      </li>


      {/* --- STYLES --- */}
      <style jsx>{`
        :global(.link) {
          width: 100%;
          color: ${theme.text.color.primary};
        }

        li {
          border: 1px solid transparent;
          border-radius: ${theme.size.radius.default};
          margin: ${`calc(${theme.space.default} * 2) 0 calc(${theme.space.default} * 3)`};
          padding: ${theme.space.inset.s};
          position: relative;
          transition: all ${theme.time.duration.default};
          background: transparent;

          &::after {
            border-top: 1px solid ${theme.line.color};
            content: "";
            height: 0;
            position: absolute;
            bottom: ${`calc(${theme.space.default} * -1.5)`};
            left: 50%;
            transform: translateX(-50%);
            transition: all ${theme.time.duration.default};
            width: 100%;
          }
        }

        h1 {
          padding: ${theme.space.m} ${theme.space.s} 0;
          line-height: ${theme.blog.h1.lineHeight};
          font-size: ${theme.blog.h1.size};
          text-remove-gap: both;

          :global(.arrow) {
            display: none;
            position: relative;
            top: 7px;
          }
        }

        .meta {
          display: flex;
          flex-flow: row wrap;
          font-size: 0.8em;
          padding: ${theme.space.m} ${theme.space.s};
          background: transparent;

          :global(svg) {
            fill: ${theme.icon.color};
            margin: ${theme.space.inline.xs};
          }

          span {
            align-items: center;
            display: flex;
            text-transform: uppercase;
            margin: ${theme.space.xs} ${theme.space.s} ${theme.space.xs} 0;
          }

          p {
            line-height: 1.5;
            padding: 0 ${theme.space.s};
            text-remove-gap: both;
          }

          .category-button {
             position: relative;
             display: block;
             width: 98px;
             height: 24px;
             line-height: 24px;
             color: white;
             text-decoration: none;
             text-align: center;
             background-color: ${theme.color.brand.primary};
             border-radius: 5px; /*角丸*/
             -webkit-transition: all 0.5s;
             transition: all 0.5s;
             -moz-user-select: none;
             -webkit-user-select: none;
             -ms-user-select: none;

             &:hover {
               background-color: ${theme.color.brand.primary};
               -webkit-transform: scale(1.02);
               -moz-transform: scale(1.02);
               -o-transform: scale(1.02);
               -ms-transform: scale(1.02);
               transform: scale(1.02);
             }
           }
        }

        .tags {
          display: flex;
          flex-flow: row wrap;
          font-size: 0.8em;
          padding: ${theme.space.m} ${theme.space.s};
          background: transparent;

          :global(svg) {
            fill: ${theme.icon.color};
            margin: ${theme.space.inline.xs};
          }

          span {
            align-items: center;
            display: flex;
            text-transform: uppercase;
            margin: ${theme.space.xs} ${theme.space.s} ${theme.space.xs} 0;
          }

          p {
            line-height: 1.5;
            padding: 0 ${theme.space.s};
            text-remove-gap: both;
          }
        }


        @from-width tablet {
          li {
            margin: ${`calc(${theme.space.default} * 3) 0 calc(${theme.space.default} * 4)`};
            padding: ${theme.space.default};

            &::after {
              bottom: ${`calc(${theme.space.default} * -2)`};
            }

            &:first-child {
              &::before {
                top: ${`calc(${theme.space.default} * -1.75)`};
              }
            }
          }

          h1 {
            font-size: ${`calc(${theme.blog.h1.size} * 1.2)`};
            padding: ${`calc(${theme.space.default} * 1.2) ${theme.space.default} 0`};
            transition: all 0.5s;
          }
          .meta {
            padding: ${`calc(${theme.space.m} * 1.5) ${theme.space.m}`};
          }
          p {
            padding: 0 ${theme.space.default};
          }
        }
        @from-width desktop {
          .meta {
            padding: ${`calc(${theme.space.default} * 1.5) calc(${theme.space.default} * 2)
              calc(${theme.space.default} * 0.5)`};
          }
          p {
            padding: ${`0 calc(${theme.space.default} * 2)`};
          }
          li {
            &:hover {


              :global(.gatsby-image-wrapper) {
                transform: scale(1.1);
              }
              h1 {
                color: ${theme.blog.h1.hoverColor};
              }
              :global(.arrow) {
                opacity: 1;
                stroke: ${theme.color.special.attention};
                transform: translateX(0);
              }
            }
            :global(.gatsby-image-wrapper) {
              transition: all ${theme.time.duration.default};
            }
            :global(.arrow) {
              display: inline-block;
              fill: ${theme.color.special.attention};
              stroke: ${theme.color.special.attention};
              stroke-width: 40;
              stroke-linecap: round;
              opacity: 0;
              transition: all 0.5s;
              transform: translateX(-50%);
            }
          }
        }

       `}</style>
    </React.Fragment>
  );
};

Item.propTypes = {
  post: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default Item;
