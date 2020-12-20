import { getRectOutlines } from '../scripts/rect-outlines1'
import { getSimpleRects } from '../scripts/simple-rects'

function getSimpleFigures(
  inhaleTime,
  exhaleTime,
  abbsTime,
  distance,
  canvasWidth,
  startMarginX
){
  let rects = getSimpleRects(
    inhaleTime,
    exhaleTime,
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


export { getSimpleFigures };
