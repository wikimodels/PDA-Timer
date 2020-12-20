import { getComplexRects } from '../scripts/complex-rects'
import { getRectOutlines } from '../scripts/rect-outlines1'

function getComplexFigures(
    pdaTime,
    inhaleTime,
    abbsTime,
    distance,
    canvasWidth,
    startMarginX
){
  let rects = getComplexRects(
    pdaTime,
    inhaleTime,
    abbsTime,
    distance,
    canvasWidth,
    startMarginX
  );
  let outlines = getRectOutlines(rects);
  rects.forEach(rect => {
    rect.height = 0;
  })
let figures = [];
  for(let i = 0; i < rects.length; i ++){
    figures.push(
      { rect: rects[i],
      outlines: outlines[i]
    }
    )
  }
  return figures;
}

export { getComplexFigures };
