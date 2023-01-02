import React from "react";

export default function VideoInput(props) {
  const { height = 300, source } = props;
  return (
    <div className="VideoInput">
      {source && (
        <video
          className="VideoInput_video"
          width="100%"
          height={height}
          controls
          src={source}
        />
      )}
      <div className="VideoInput_footer" data-testid="video-footer">
        {source || "Nothing selectd, please refresh page and select again"}
      </div>
    </div>
  );
}
