import React, {
  memo,
  useCallback,
  useEffect,
  // useRef,
  useState,
} from 'react';
import {
  Container,
  Graphics,
  SimpleRope,
  // Sprite,
  Stage,
  TilingSprite,
  useTick,
  // withFilters,
} from '@inlet/react-pixi';
// import {AdjustmentFilter} from '@pixi/filter-adjustment';
import * as PIXI from 'pixi.js';
// import './App.css';
// import {app} from './pixi/base/application';
// import {init} from './pixi';
// import bubbleImage from './bubble_32x32.png';
import snakeImage from './snake2.png';
// import vertexShader from './vertex.glsl';
// import fragmentShader from './fragment.glsl';
import background from './images/bg54.jpg';
import simplify from 'simplify-js';
// import cosmosImage from './images/cosmos.jpg';


// const shader = PIXI.Shader.from(vertexShader, fragmentShader, {
//   iResolution: [window.innerWidth, window.innerHeight],
//   iTime: 0,
// });

const RADIUS = 8;
const MAX_WIDTH = 10000;
const MAX_HEIGHT = 10000;
const MIN_SCALE = 0.1;
const STEP_SCALE = 0.1;
const SIMPLIFY_TOLERANCE = 2;
const SIMPLIFY_QIALITY = true;

// const Filters = withFilters(Container, {
//   blur: PIXI.filters.BlurFilter,
//   adjust: AdjustmentFilter,
// });


// @ts-ignore
const SnakePoints = memo(({points}) => {
  return (
    <Graphics
      // filters={[new PIXI.filters.BlurFilter(5, 1, PIXI.settings.FILTER_RESOLUTION, 15)]}
      x={0}
      y={0}
      draw={g => {
        g.clear();
        g.lineStyle(RADIUS*1.1, 0xff7979);

        g.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          g.lineTo(points[i].x, points[i].y);
        }

        g.lineStyle(1, 0xffffff);
        // g.beginFill(0xff0022);
        g.beginFill(0xff7979);
        for (let i = 0; i < points.length; i++) {
          g.drawCircle(points[i].x, points[i].y, RADIUS * .9);
        }
        g.endFill();
      }} />
  );
});


// @ts-ignore
const createSnake = ({x, y, length}) => {
  const points = [];
  for (let i = 0; i < length; i++) {
    points.push(new PIXI.Point(x + i * RADIUS * 2, y));
  }
  return points;
};

// @ts-ignore
const Snake = memo(({points, showPoints = true, size}) => {
  // shader.uniforms.iTime += 0.1;
  // shader.uniforms.iResolution = [window.innerWidth, window.innerHeight];
  const simplifiedPoints = simplify(points, SIMPLIFY_TOLERANCE, SIMPLIFY_QIALITY);
  // console.log(points.length, simplifiedPoints.length,);

  return (
    <Container>
      {/* @ts-ignore */}
      {showPoints && <SnakePoints points={simplifiedPoints} />}
      {!showPoints && <SimpleRope
        key={[points.length, simplifiedPoints.length].toString()}
        image={snakeImage}
        // @ts-ignore
        points={simplifiedPoints}
        // points={points}
        filters={[new PIXI.filters.BlurFilter(.25, 1, PIXI.settings.FILTER_RESOLUTION, 15)]}
      />}
    </Container>
  );
});


// @ts-ignore
export const Game = memo(({mouseEvent, size, scale, setMouseEvent, mouseDown}) => {
  const [speed, setSpeed] = useState(2);
  const [length, setLength] = useState(25);
  const [vector, setVector] = useState({x: -1, y: 1});
  // const [pos, setPos] = useState({x: window.innerWidth / 2, y: window.innerHeight / 2});
  const [mouse, setMouse] = useState({x: 0, y: 0});
  const [showPoints, setShowPoints] = useState(true);
  const [points, setPoints] = useState(createSnake({
    x: 50, //window.innerWidth / 2,
    y: 50, //window.innerHeight / 2,
    length,
  }));

  const slowDown = useCallback(() => {
    setSpeed(2);
  }, [setSpeed]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowPoints(value => !value);
      return;
    }
    if (e.key === '+') {
      setLength(len => len + 5);
    } else if (e.key === '-') {
      setLength(len => len > 10 ? len - 5 : 10);
    }
    if (e.shiftKey) {
      console.log('shift down', e.shiftKey);
      setSpeed(20);
    }
  }, [setSpeed, setLength, setShowPoints]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!e.shiftKey && speed > 2) {
      slowDown();
    }
  }, [slowDown, speed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (!mouseEvent) {
      return;
    }
    const e = mouseEvent;
    // const mx = e.pageX*scale - size.width/2 + points[0].x*scale;
    // const my = e.pageY*scale - size.height/2 + points[0].y*scale;
    const mx = (e.pageX - (size.width/2 - points[0].x*scale))/scale;
    const my = (e.pageY - (size.height/2 - points[0].y*scale))/scale;
    const dx = mx - points[0].x;
    const dy = my - points[0].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const vx = dx / distance;
    const vy = dy / distance;
    setMouse({x: mx, y: my});
    if (mx >= 0 && mx < MAX_WIDTH && my >= 0 && my < MAX_HEIGHT) {
      setVector({x: vx, y: vy});
    }
  }, [mouseEvent, scale, setMouse, setVector, size, points, setMouseEvent, mouseDown]);

  // const i = useRef(0);

  const animate = useCallback((delta) => {
    // const iter = i.current += 0.1 * delta;
    const prevLength = points.length;
    const dLength = length - prevLength;
    const np = dLength <= 0
      ? [...points]
      : [...points, ...Array(length - points.length)];
    np.length = length;
    const last = np[prevLength - 1];
    let vx = vector.x * speed, vy = vector.y * speed, dx = 0, dy = 0;

    for (let j = 0; j < length; ++j) {
      if (np[j] === undefined) {
        np[j] = new PIXI.Point(last.x - vx, last.y - vy);
        // console.error(index, [vx, vy], prevLength, length, last, np[j], RADIUS);
      } else {
        if (j === 0) {
          if (np[0].x + vx - RADIUS < 0 || np[0].x + vx + RADIUS >= MAX_WIDTH) {
            vector.x = -vector.x;
            setVector({x: vector.x, y: vector.y});
          }
          if (np[0].y + vy - RADIUS < 0 || np[0].y + vy + RADIUS >= MAX_HEIGHT) {
            vector.y = -vector.y;
            setVector({x: vector.x, y: vector.y});
          }
        } else {
          dx = np[j - 1].x - np[j].x;
          dy = np[j - 1].y - np[j].y;
          vx = (dx / (RADIUS * 2 + 4)) * speed;
          vy = (dy / (RADIUS * 2 + 4)) * speed;
        }
        np[j].x += vx;// + Math.cos((j * .5) + iter) * 0.2;
        np[j].y += vy;// + Math.sin((j * .5) + iter) * 0.2;
      }
    }

    setPoints(np);
  }, [length, points, speed, vector]);

  useEffect(() => {
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useTick(delta => {
    animate(delta);
  });

  return (
    <Container>
      <Container
        scale={scale}
        x={size.width/2 - points[0].x*scale}
        y={size.height/2 - points[0].y*scale}
      >
        {/*<TilingSprite*/}
        {/*  image={cosmosImage}*/}
        {/*  width={MAX_WIDTH+size.width*2}*/}
        {/*  height={MAX_HEIGHT+size.height*2}*/}
        {/*  x={-size.width}*/}
        {/*  y={-size.height}*/}
        {/*  tilePosition={{x: 0, y: 0}}*/}
        {/*  tileScale={{x: 1, y: 1}}*/}
        {/*/>*/}
        <TilingSprite
          image={background}
          width={MAX_WIDTH}
          height={MAX_HEIGHT}
          tilePosition={{x: 0, y: 0}}
          tileScale={{x: 1, y: 1}}
        />
        <Graphics
          draw={g => {
            g.clear();
            g.lineStyle(10, 0xfa0f0f);
            // g.beginFill(0x030303, 1.0);
            g.drawRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
            // g.endFill();
          }}
        />
        {/* @ts-ignore */}
        <Snake showPoints={showPoints}
               points={points}
               size={size}
        />
        <Graphics
          x={0} y={0}
          draw={g => {
            g.clear();
            g.beginFill(0xafffaf, 0.1);
            g.lineStyle(2, 0xafffaf, .5);
            g.moveTo(mouse.x, mouse.y - RADIUS * 5);
            g.lineTo(mouse.x, mouse.y + RADIUS * 5);
            g.moveTo(mouse.x - RADIUS * 5, mouse.y);
            g.lineTo(mouse.x + RADIUS * 5, mouse.y);
            g.drawCircle(mouse.x, mouse.y, RADIUS * 3);
            // g.drawCircle(window.innerWidth / 2, window.innerHeight / 2, 150);
            g.endFill();
          }}
        />
      </Container>
    </Container>
  );
});


export const App = () => {
  const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
  const [mouseEvent, setMouseEvent] = useState(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [scale, setScale] = useState(1);

  const resize = useCallback(() => {
    setSize({width: window.innerWidth, height: window.innerHeight});
  }, [setSize]);

  const handleMouseDown = useCallback((e) => {
    if (e.buttons === 1) {
      setMouseEvent(e);
      setMouseDown(true);
    }
  }, [setMouseEvent, setMouseDown]);

  const handleWheel = useCallback((e: WheelEvent) => {
    const ds = Math.sign(-e.deltaY);
    setScale(s => {
      let result = s + (ds > 0 ? STEP_SCALE : -STEP_SCALE);
      result = result >= MIN_SCALE ? result : MIN_SCALE;
      return result;
    });
  }, [setScale, scale])

  useEffect(() => {
    window.addEventListener('resize', resize, false);
    window.addEventListener('wheel', handleWheel, false);
    return () => {
      window.removeEventListener('resize', resize, false);
      window.removeEventListener('wheel', handleWheel, false);
    };
  }, [handleWheel, resize]);

  return (
    <Stage width={size.width} height={size.height}
           options={{backgroundAlpha: 0, backgroundColor: 0, antialias: true}}
           onPointerDown={handleMouseDown}
           onPointerUp={() => {
             setMouseDown(false);
             setMouseEvent(null);
           }}
           onPointerMove={handleMouseDown}
    >
      {/* @ts-ignore */}
      <Game mouseEvent={mouseEvent}
            setMouseEvent={setMouseEvent}
            mouseDown={mouseDown}
            size={size}
            scale={scale}
      />
    </Stage>
  );
};
