import React from "react";
import useCanvas from "../hooks/useCanvas";

const Canvas = (props: any) => {
  const { draw, clickHandler, ...rest } = props;
  const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} onClick={clickHandler} {...rest} />;
};

export default Canvas;
