

// GET LINES
function getRectOutlines(rects) {
  let rightOutlines = setLeftOutlines(rects);
  let topOutlines = setTopOutlines(rects);
  let leftOutlines = setRightOutlines(rects);
  let outlines = [];
  for (let i = 0; i < rects.length; i++) {
    let outline = {
      leftOutline: leftOutlines[i],
      topOutline: topOutlines[i],
      rightOutline: rightOutlines[i],
    };
    outlines.push(outline);
  }
  return outlines;
}
// SET LEFT OUTLINES
function setLeftOutlines(rects) {
  const leftOutlines = [];
  rects.forEach((rect) => {
    let outline = {
      x1: rect.x,
      y1: 0,
      x2: rect.x,
      y2: rect.height,
    };
    leftOutlines.push(outline);
  });
  return leftOutlines;
}

// SET TOP OUTLINES
function setTopOutlines(rects) {
  const topOutlines = [];
  rects.forEach((rect) => {
    let outline = {
      x1: rect.x,
      y1: rect.height,
      x2: rect.x + rect.width,
      y2: rect.height,
    };
    topOutlines.push(outline);
  });
  return topOutlines;
}

// SET RIGHT OUTLINES
function setRightOutlines(rects) {
  const rightOutlines = [];
  rects.forEach((rect) => {
    let outline = {
      x1: rect.x + rect.width,
      y1: rect.height,
      x2: rect.x + rect.width,
      y2: 0,
    };
    rightOutlines.push(outline);
  });
  return rightOutlines;
}

export { getRectOutlines };
