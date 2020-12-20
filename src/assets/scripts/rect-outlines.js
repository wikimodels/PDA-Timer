

// GET LINES
function getRectOutlines(rects) {
  let line1 = setOutlines1(rects);
  let line2 = setOutlines2(rects);
  let line3 = setOutlines3(rects);
  let lines = [];
  for (let i = 0; i < rects.length; i++) {
    let line = {
      line1: line1[i],
      line2: line2[i],
      line3: line3[i],
    };
     lines.push(line);
  }
  return lines;
}
// SET OUTLINES1
function setOutlines1(rects) {
  const lines1 = [];
  rects.forEach((rect) => {
    let line = {
      x1: rect.x,
      y1: 0,
      x2: rect.x,
      y2: rect.height,
    };
    lines1.push(line);
  });
  return lines1;
}

// SET OUTLINES2
function setOutlines2(rects) {
  const lines2 = [];
  rects.forEach((rect) => {
    let line = {
      x1: rect.x,
      y1: rect.height,
      x2: rect.x + rect.width,
      y2: rect.height,
    };
    lines2.push(line);
  });
  return lines2;
}

// SET OUTLINES3
function setOutlines3(rects) {
  const lines3 = [];
  rects.forEach((rect) => {
    let line = {
      x1: rect.x + rect.width,
      y1: rect.height,
      x2: rect.x + rect.width,
      y2: 0,
    };
    lines3.push(line);
  });
  return lines3;
}

export { getRectOutlines };
