export interface Figure {
  rect: Rectangle;
  outlines: Outlines;
}

interface Rectangle {
  id: string;
  x: number;
  width: number;
  height: number;
  animeHeight: number;
  fill: string;
  distance: number;
}

interface Outlines {
  leftOutline: { x1: number; y1: number; x2: number; y2: number };
  topOutline: { x1: number; y1: number; x2: number; y2: number };
  rightOutline: { x1: number; y1: number; x2: number; y2: number };
}
