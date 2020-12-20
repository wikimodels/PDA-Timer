function setSvg(isScreenMoreThan400){
  let width = 0;
    let height = 0;

    let breakBtwRects = 0;

    if (isScreenMoreThan400) {
      width = 510;
      height = 310;
      breakBtwRects = 0;
    } else {
      width = 550;
      height = 400;
      breakBtwRects = 0;
    }
    return {
      width: width,
      height: height,
      breakBtwRects: breakBtwRects,
      viewBox: function () {
        return `0 0 ${this.width} ${this.height}`;
      },
    };
}

function setCanvas(svg){
  return {
    width: svg.width - 20,
    height: svg.height - 35,
    rectGroup: function () {
      return `scale(1,-1) translate(0,-${this.height + 20})`;
    },
    linesGroup: function () {
      return `translate(10, 20)`;
    },
  };
}

function calculateLinesCoordinates(width, height, numberOfLines) {
  const distance = height / numberOfLines;
  const linesCoordinates = [];
  for (let i = 0; i < numberOfLines + 1; i++) {
    let obj = {
      x1: 18,
      y1: distance * i,
      x2: width,
      y2: distance * i,
    };
    linesCoordinates.push(obj);
  }
  return linesCoordinates;
}

function calculateDistanceBtwLines(canvasHeight, numberOfSeconds) {
  return canvasHeight / numberOfSeconds;
}

function calculateLablesCoordinates(height, numberOfLines) {
  const lablesCoordinates = [];
  const distance = height / numberOfLines;
  for (let i = 0; i < numberOfLines + 1; i++) {
    const obj = {
      x: 0,
      y: distance * i + 4,
      value: numberOfLines - i,
    };
    lablesCoordinates.push(obj);
  }
  return lablesCoordinates;
}

export {
  setSvg,
  setCanvas,
  calculateDistanceBtwLines,
  calculateLinesCoordinates,
  calculateLablesCoordinates
}
