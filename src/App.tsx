import React, {useEffect, useRef} from 'react';
import './App.css';
import {app} from './pixi/base/application';
import {init} from './pixi';


function App() {

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init();
    ref.current?.appendChild(app.view);
  }, []);

  return (
    <div className="App" ref={ref}>
    </div>
  );
}

export default App;
