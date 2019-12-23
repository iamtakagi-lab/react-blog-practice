import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { FaCalendar } from "react-icons/fa/";
import { FaUser } from "react-icons/fa/";
import { FaTag } from "react-icons/fa/";

const style = {
  tags: {
    display: "flex",
    flexFlow: "row wrap",
    fontSize: "0.8em",
    margin: "${theme.space.m} 0",
    background: "transparent",
    paddingBottom: "20px",
    span: {
      fontSize: "0.9em",
      alignItems: "center",
      display: "flex",
      textTransform: "uppercase",
      margin: "${theme.space.xs} ${theme.space.s} ${theme.space.xs} 0",
    },
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
  }
};

const Meta = props => {
  const { prefix, author: authorName, category, tags, theme } = props;

  const getTags = (tags) => {
    if(tags != null) {
      const toReturn = [];
      tags.forEach((tag) => {
        toReturn.push(tag)
      });
      return toReturn;
    }
  };

  const getTagElements = getTags(tags).map((a) =>
    <Link to={`/tag/${a.split(" ").join("-").toLowerCase()}`}>
      <span className="tagbtn" style={style.tags.tagbtn}>#{a}
      </span>
    </Link>
  );

  return (
    <React.Fragment>
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
        <FaUser size={18} /> {authorName}
      </span>

      {/* --- STYLES --- */}
      <style jsx>{`
        .meta {
          display: flex;
          flex-flow: row wrap;
          font-size: 0.8em;
          margin: ${theme.space.m} 0;
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
          }
        }
        @from-width tablet {
          .meta {
            margin: ${`calc(${theme.space.m} * 1.5) 0 ${theme.space.m}`};
          }
        }
      `}</style>
    </p>

      <p className="tags" style={style.tags}>
        {getTagElements}
      </p>
    </React.Fragment>
  );
};

Meta.propTypes = {
  prefix: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  category: PropTypes.string,
  tags: PropTypes.array.string,
  theme: PropTypes.object.isRequired
};

export default Meta;
