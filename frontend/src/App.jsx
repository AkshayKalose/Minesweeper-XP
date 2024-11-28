import React from 'react';
import Minesweeper from './Minesweeper';
import WindowsStyle from './WindowsStyle';
import { BEGINNER_SIZE } from './windowSizes';
import { Quit } from '../wailsjs/runtime/runtime';

function App() {
  const [platform, setPlatform] = React.useState(
    window.innerWidth <= 768 ? 'desktop' : 'desktop', // Force desktop view.
  );
  const [lastTouch, setLastTouch] = React.useState(new Date());
  const [samePos, setSamePos] = React.useState(false);
  React.useEffect(() => {
    function onResize() {
      if (window.innerWidth <= 768) {
        setPlatform('desktop');
      } else {
        setPlatform('desktop');
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  React.useEffect(() => {
    function touchStart() {
      setSamePos(true);
      setLastTouch(new Date());
    }
    function touchMove() {
      setSamePos(false);
    }
    window.addEventListener('touchstart', touchStart);
    window.addEventListener('touchmove', touchMove);
    return () => {
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
    };
  }, []);

  const [windowTitleWidth, setWindowTitleWidth] = React.useState(BEGINNER_SIZE.width);
  const [style, setStyle] = React.useState(0);

  return (
    <div
      style={
        platform === 'desktop'
          ? {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            height: '100%',
          }
          : {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            height: '100%',
          }
      }
    >
      <div
        style={
          platform === 'desktop'
            ? {
              display: 'inline-block',
              overflow: 'hidden',
            }
            : {
              transform: 'scale(1.8)',
              transformOrigin: 'left top',
              display: 'inline-block',
            }
        }
      >
        <WindowsStyle
          windowTitleWidth={windowTitleWidth}
          style={style}
        >
          <Minesweeper
            defaultDifficulty="Beginner"
            sameTouchPos={samePos}
            lastTouch={lastTouch}
            platform={platform}
            setWindowTitleWidth={setWindowTitleWidth}
            onClose={Quit}
            style={style}
            setStyle={setStyle}
          />
        </WindowsStyle>
      </div>
    </div>
  );
}

export default App
