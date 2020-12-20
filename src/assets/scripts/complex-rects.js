// GET COMPLEX RECTS
function getComplexRects(
  pdaTime,
  inhaleTime,
  abbsTime,
  distance,
  canvasWidth,
  startMarginX
) {
  let rects = setExhaleAndHaltRects(pdaTime, inhaleTime, abbsTime, distance);
  rects = setInhaleRect(inhaleTime, distance, rects);
  rects = setAbbsRect(abbsTime, distance, rects);
  rects = setRectWidth(canvasWidth, startMarginX, rects);
  rects = setDistance(distance, rects);
  rects = setRectX(startMarginX, canvasWidth, rects);
  console.log("getRect-array", rects);
  return rects;
}

// SET EXHALE AND HALT RECTS
function setExhaleAndHaltRects(pdaTime, inhaleTime, abbsTime, distance) {
  const rects = [];
  let exhaleAndHaltTime = pdaTime - inhaleTime - abbsTime;

  let index = 1;
  while (exhaleAndHaltTime > 0) {
    //Push exhale obj
    let exhaleValue = exhaleAndHaltTime - 6 >= 0 ? 6 : exhaleAndHaltTime;
    let exhaleObj = {
      id: "exhale-" + index,
      width: 0,
      fill: "blue",
      class: 'exhaleRect',
      height: distance * exhaleValue,
      animeHeight: 0,
      x: 0,
    };
    rects.push(exhaleObj);
    exhaleAndHaltTime = exhaleAndHaltTime - 6;

    if (exhaleAndHaltTime <= 0) {
      break;
    }
    // Push HaltObj
    let haltObj = {
      id: "ticktack-" + index,
      width: 0,
      fill: "grey",
      class: "ticktackRect",
      height: distance * 1,
      x: 0,
    };
    rects.push(haltObj);
    exhaleAndHaltTime = exhaleAndHaltTime - 1;
    if (exhaleAndHaltTime <= 0) {
      break;
    }
    index++;
  }
  return rects;
}

// SET INHALE RECT
function setInhaleRect(inhaleTime, distance, rects) {
  let inhaleObj = {
    id: "inhale",
    width: 0,
    fill: "green",
    class: "inhaleRect",
    height: distance * inhaleTime,
    x: 0,
  };
  rects.unshift(inhaleObj);
  return rects;
}

// SET ABBS RECT
function setAbbsRect(abbsTime, distance, rects) {
  let abbsObj = {
    id: "abbs",
    width: 0,
    fill: "yellow",
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
export { getComplexRects }
