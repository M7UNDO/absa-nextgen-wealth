import React from "react";
import {Link} from "react-router-dom";

function Track({image, title, description, page}) {
  return (
    <div className="track-selection">
      <div className="track-info">
        <h3>{title}</h3>
        <p className="track-description">{description}</p>
        <Link to={page} className="explore-btn">
          Explore Path
        </Link>
      </div>
      {image ? <img src={image} alt={title} className="track-image" /> : <div className="image-placeholder"></div>}
    </div>
  );
}

export default Track;
