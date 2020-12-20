// GET SIMPLE RECTS
function getSimpleRects(
  inhaleTime,
  exhaleTime,
  abbsTime,
  distance,
  canvasWidth,
  startMarginX
) {
  let rects = [];
  rects = setInhaleRect(inhaleTime, distance, rects);
  rects = setExhaleRect(exhaleTime, distance, rects);
  rects = setAbbsRect(abbsTime, distance, rects);
  rects = setRectWidth(canvasWidth, startMarginX, rects);
  rects = setDistance(distance, rects);
  rects = setRectX(startMarginX, canvasWidth, rects);
  return rects;
}

// SET INHALE RECT
function setInhaleRect(inhaleTime, distance, rects) {
  let inhaleObj = {
    id: "inhale",
    width: 0,
    class: "inhaleRect",
    height: distance * inhaleTime,
    animeHeight: 0,
    x: 0,
  };
  rects.unshift(inhaleObj);
  return rects;
}

// SET EXHALE RECT
function setExhaleRect(exhaleTime, distance, rects) {
  let exhaleObj = {
    id: "exhale",
    width: 0,
    class: "exhaleRect",
    height: distance * exhaleTime,
    x: 0,
  };
  rects.push(exhaleObj);
  return rects;
}

// SET ABBS RECT
function setAbbsRect(abbsTime, distance, rects) {
  let abbsObj = {
    id: "abbs",
    width: 0,
    class: "abbsRect",
    height: distance * abbsTime,
    x: 0,
  };
  rects.push(abbsObj);
  return rects;
}

// SET RECT WIDTH
function setRectWidth(canvasWidth, startMarginX, rects) {
  const width = (canvasWidth - startMarginX) / rects.length;
  rects.forEach((item) => (item.width = width));
  return rects;
}

// SET DISTANCE
function setDistance(distance, rects) {
  rects.forEach((item) => (item.distance = distance));
  return rects;
}

// SET RECT X
function setRectX(startMarginX, canvasWidth, rects) {
  const width = (canvasWidth - startMarginX) / rects.length;
  rects.forEach((item, i) => {
    item.x = startMarginX + width * i;
    return item;
  });
  return rects;
}

export { getSimpleRects };
