import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import dead from '../assets/dead.png';
import smile from '../assets/smile.png';
import win from '../assets/win.png';
import ohh from '../assets/ohh.png';
import empty from '../assets/empty.png';
import open1 from '../assets/open1.png';
import open2 from '../assets/open2.png';
import open3 from '../assets/open3.png';
import open4 from '../assets/open4.png';
import open5 from '../assets/open5.png';
import open6 from '../assets/open6.png';
import open7 from '../assets/open7.png';
import open8 from '../assets/open8.png';
import flag from '../assets/flag.png';
import mine from '../assets/mine-ceil.png';
import mineDeath from '../assets/mine-death.png';
import misFlagged from '../assets/misflagged.png';
import question from '../assets/question.png';
import checked from '../assets/checked.png';
import digit0 from '../assets/digit0.png';
import digit1 from '../assets/digit1.png';
import digit2 from '../assets/digit2.png';
import digit3 from '../assets/digit3.png';
import digit4 from '../assets/digit4.png';
import digit5 from '../assets/digit5.png';
import digit6 from '../assets/digit6.png';
import digit7 from '../assets/digit7.png';
import digit8 from '../assets/digit8.png';
import digit9 from '../assets/digit9.png';
import digit_ from '../assets/digit-.png';

import { BrowserOpenURL, WindowSetSize } from '../../wailsjs/runtime';
import { BEGINNER_SIZE, EXPERT_SIZE, INTERMEDIATE_SIZE } from '../windowSizes';

const digits = [
  digit0,
  digit1,
  digit2,
  digit3,
  digit4,
  digit5,
  digit6,
  digit7,
  digit8,
  digit9,
];
function renderDigits(number) {
  let numberStr;
  if (number < 0) {
    const _number = -number % 100;
    if (_number === 0) {
      numberStr = '00';
    } else if (_number < 10) {
      numberStr = '0' + _number;
    } else {
      numberStr = String(_number);
    }
    return (
      <>
        <img src={digit_} alt="-" />
        {numberStr.split('').map((n, i) => (
          <img src={digits[n]} key={i} alt={n} />
        ))}
      </>
    );
  }

  numberStr = number < 999 ? String(number) : '999';
  if (number < 10) numberStr = '00' + numberStr;
  else if (number < 100) numberStr = '0' + numberStr;
  return numberStr
    .split('')
    .map((n, i) => <img key={i} src={digits[n]} alt={n} />);
}

function MineSweeperView({
  ceils,
  className,
  changeCeilState,
  onReset,
  openCeil,
  openCeils,
  mines,
  status,
  seconds,
  onClose,
  difficulty,
  openingCeil,
  openingCeils,
  sameTouchPos,
  lastTouch,
  setWindowTitleWidth,
  style,
  setStyle,
}) {
  const face = useRef(null);
  const dropDown = useRef(null);
  const topBar = useRef(null);
  const [mouseDownContent, setMouseDownContent] = useState(false);
  const [openOption, setOpenOption] = useState(null);
  const [openBehavior, setOpenBehavior] = useState({ index: -1, behavior: '' });
  function remainMines() {
    return (
      mines -
      ceils.filter(ceil => ceil.state === 'flag' || ceil.state === 'misflagged')
        .length
    );
  }
  function statusFace() {
    if (mouseDownContent) return <img alt="ohh" src={ohh} />;
    switch (status) {
      case 'died':
        return <img alt="dead" src={dead} />;
      case 'won':
        return <img alt="win" src={win} />;
      default:
        return <img alt="smile" src={smile} />;
    }
  }
  function onMouseDownContent(e) {
    if (e.button !== 0) return;
    if (
      face.current.contains(e.target) ||
      status === 'won' ||
      status === 'died'
    )
      return;
    setMouseDownContent(true);
  }
  useEffect(() => {
    const { index, behavior } = openBehavior;
    switch (behavior) {
      case 'single':
        return openingCeil(index);
      case 'multi':
        return openingCeils(index);
      default:
        openingCeil(-1);
    }
  }, [openBehavior.index, openBehavior.behavior]);
  function onMouseDownCeils(e, index) {
    if (e.button === 4 || e.buttons === 3 || e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
      // e.button === 4 -> Middle click (scroll wheel).
      // e.buttons === 3 -> Primary + secondary button pressed simultaneously.
      // Or, any button click while holding down any key in (Ctrl, Alt, Shift, Meta).
      setOpenBehavior({
        index,
        behavior: 'multi', // Chording.
      });
    } else if (e.button === 2) {
      // Right click.
      changeCeilState(index);
    } else if (e.button === 0) {
      // Left click.
      setOpenBehavior({
        index,
        behavior: 'single',
      });
    }
  }
  function onMouseOverCeils(index) {
    setOpenBehavior({
      index,
      behavior: openBehavior.behavior,
    });
  }
  function onMouseUpCeils() {
    const { behavior, index } = openBehavior;
    if (index === -1) return;
    if (behavior === 'single') {
      openCeil(index);
    } else if (behavior === 'multi') {
      openCeils(index);
    }
  }
  function hoverOption(option) {
    if (openOption) setOpenOption(option);
  }
  function onMouseUp(e) {
    setOpenBehavior({ index: -1, behavior: '' });
    setMouseDownContent(false);
    if (!dropDown.current.contains(e.target)) setOpenOption('');
  }
  function onTouchEndDropdown(e) {
    if (
      !dropDown.current.contains(e.target) &&
      !topBar.current.contains(e.target)
    )
      setOpenOption('');
  }
  function onTouchEndCeils(e) {
    const index = Array.prototype.indexOf.call(
      e.currentTarget.children,
      e.target.closest('.mine__ceil'),
    );
    if (index === -1 || !sameTouchPos) return;
    if (new Date() - lastTouch < 150) {
      if (ceils[index].state === 'open') {
        openCeils(index);
      } else {
        openCeil(index);
      }
    } else {
      changeCeilState(index);
    }
  }
  useEffect(() => {
    window.addEventListener('touchend', onTouchEndDropdown);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onTouchEndDropdown);
    };
  }, []);

  useEffect(() => {
    // Increase the height or width of the window to when the menus are open.
    if (difficulty === 'Beginner') {
      if (openOption === 'Game') {
        WindowSetSize(BEGINNER_SIZE.width, BEGINNER_SIZE.height + 64);
      } else if (openOption === 'Help') {
        WindowSetSize(BEGINNER_SIZE.width + 64, BEGINNER_SIZE.height);
      } else {
        WindowSetSize(BEGINNER_SIZE.width, BEGINNER_SIZE.height);
      }
    }
  }, [openOption]);

  useEffect(() => {
    // Change window size when the difficulty changes.
    if (difficulty === 'Beginner') {
      WindowSetSize(BEGINNER_SIZE.width, BEGINNER_SIZE.height + 64); // TODO: Remove the extra height, if closing the open menu on difficulty selection.
      setWindowTitleWidth(BEGINNER_SIZE.width);
    } else if (difficulty === 'Intermediate') {
      WindowSetSize(INTERMEDIATE_SIZE.width, INTERMEDIATE_SIZE.height);
      setWindowTitleWidth(INTERMEDIATE_SIZE.width);
    } else if (difficulty === 'Expert') {
      WindowSetSize(EXPERT_SIZE.width, EXPERT_SIZE.height);
      setWindowTitleWidth(EXPERT_SIZE.width);
    }
  }, [difficulty]);

  useEffect(() => {
    // Switch the theme when style changes.
    document.getElementsByTagName('html')[0].setAttribute('data-theme', ['XP', '98', '3.1'][style]);
  }, [style]);

  return (
    <div className={className} onContextMenu={e => e.preventDefault()}>
      <div className="mine__drop-downs" ref={dropDown}>
        <div
          style={{ visibility: openOption === 'Game' ? 'visible' : 'hidden' }}
          className="mine__drop-down"
        >
          <div className="mine__drop-down__title">Game</div>
          <div className="mine__drop-down__menu">
            <div className="mine__drop-down__row" onMouseUp={() => onReset()}>
              <div className="mine__drop-down__check" />
              <div className="mine__drop-down__text">New</div>
              <span className="mine__drop-down__hot-key">F2</span>
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__separator" />
            <div
              className="mine__drop-down__row"
              onMouseUp={() => onReset('Beginner')}
              onTouchStart={() => onReset('Beginner')}
            >
              <div className="mine__drop-down__check">
                {difficulty === 'Beginner' && (
                  <img src={checked} alt="checked" />
                )}
              </div>
              <span>Beginner</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div
              className="mine__drop-down__row"
              onMouseUp={() => onReset('Intermediate')}
              onTouchStart={() => onReset('Intermediate')}
            >
              <div className="mine__drop-down__check">
                {difficulty === 'Intermediate' && (
                  <img src={checked} alt="checked" />
                )}
              </div>
              <span>Intermediate</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div
              className="mine__drop-down__row"
              onMouseUp={() => onReset('Expert')}
              onTouchStart={() => onReset('Expert')}
            >
              <div className="mine__drop-down__check">
                {difficulty === 'Expert' && <img src={checked} alt="checked" />}
              </div>
              <span>Expert</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__row">
              <div className="mine__drop-down__check" />
              <span>Custom...</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__separator" />
            <div className="mine__drop-down__row">
              <div className="mine__drop-down__check">
                <img src={checked} alt="checked" />
              </div>
              <span>Marks (?)</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__row">
              <div className="mine__drop-down__check">
                <img src={checked} alt="checked" />
              </div>
              <span>Color</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__row">
              <div className="mine__drop-down__check" />
              <span>Sound</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__separator" />
            <div className="mine__drop-down__row">
              <div className="mine__drop-down__check" />
              <span>Best Times...</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__separator" />

            <div className="mine__drop-down__row" onMouseUp={onClose}>
              <div className="mine__drop-down__check" />
              <span>Exit</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
          </div>
        </div>
        <div
          style={{ visibility: openOption === 'Help' ? 'visible' : 'hidden' }}
          className="mine__drop-down"
        >
          <div className="mine__drop-down__title">Help</div>
          <div className="mine__drop-down__menu">
            <div className="mine__drop-down__row">
              <div className="mine__drop-down__check" />
              <div className="mine__drop-down__text">Contents</div>
              <span className="mine__drop-down__hot-key">F1</span>
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__row">
              <div className="mine__drop-down__check" />
              <div className="mine__drop-down__text">Search for Help on...</div>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__row">
              <div className="mine__drop-down__check" />
              <div className="mine__drop-down__text">Using Help</div>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__separator" />
            <div className="mine__drop-down__row">
              <div className="mine__drop-down__check" />
              <div className="mine__drop-down__text">About Minesweeper...</div>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__separator" />
            <div className="mine__drop-down__row"
              onMouseUp={() => setStyle(0)}
              onTouchStart={() => setStyle(0)}
            >
              <div className="mine__drop-down__check">
                { style === 0 &&
                  <img src={checked} alt="checked" />
                }
              </div>
              <span>Windows XP Style</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__row"
              onMouseUp={() => setStyle(1)}
              onTouchStart={() => setStyle(1)}
            >
              <div className="mine__drop-down__check">
                { style === 1 &&
                  <img src={checked} alt="checked" />
                }
              </div>
              <span>Windows 98 Style</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__row"
              onMouseUp={() => setStyle(2)}
              onTouchStart={() => setStyle(2)}
            >
              <div className="mine__drop-down__check">
                { style === 2 &&
                  <img src={checked} alt="checked" />
                }
              </div>
              <span>Windows 3.1 Style</span>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
            <div className="mine__drop-down__separator" />
            <div className="mine__drop-down__row">
              <div className="mine__drop-down__check" />
              <a
                className="mine__drop-down__text"
                href="#"
                onClick={() => {BrowserOpenURL("https://git.new/Minesweeper-XP")}}
              >
                GitHub
              </a>
              <span className="mine__drop-down__hot-key" />
              <div className="mine__drop-down__arrow" />
            </div>
          </div>
        </div>
      </div>
      <div className="mine__top-bar" ref={topBar}>
        <div
          onMouseDown={() => setOpenOption('Game')}
          onTouchStart={() => setOpenOption(openOption ? '' : 'Game')}
          onMouseOver={() => hoverOption('Game')}
          className="mine__top-bar__text"
        >
          Game
        </div>
        <div
          onMouseDown={() => setOpenOption('Help')}
          onTouchStart={() => setOpenOption(openOption ? '' : 'Help')}
          onMouseOver={() => hoverOption('Help')}
          className="mine__top-bar__text"
        >
          Help
        </div>
      </div>
      <section className="mine__content" onMouseDown={onMouseDownContent}>
        <div className="mine__score-bar">
          <div className="mine__digits__outer">
            {renderDigits(remainMines())}
          </div>
          <div className="mine__face__outer">
            <div ref={face} className="mine__face" onClick={() => onReset()}>
              {statusFace()}
              <img alt="smile" src={smile} />
            </div>
          </div>
          <div className="mine__digits__outer">{renderDigits(seconds)}</div>
        </div>
        <div
          className="mine__content__inner"
          onTouchEnd={onTouchEndCeils}
          onMouseUp={onMouseUpCeils}
        >
          <Ceils
            ceils={ceils}
            onMouseDown={onMouseDownCeils}
            onMouseEnter={onMouseOverCeils}
          />
        </div>
      </section>
    </div>
  );
}
function getTextImg(index) {
  return [empty, open1, open2, open3, open4, open5, open6, open7, open8][index];
}
function Ceils({ ceils, onMouseDown, onMouseEnter }) {
  function renderContent(ceil) {
    const { state, minesAround, opening } = ceil;
    switch (state) {
      case 'open':
        return <MinesAround mines={minesAround} />;
      case 'flag':
        return <Flag />;
      case 'misflagged':
        return <MisFlagged />;
      case 'mine':
        return <Mine />;
      case 'die':
        return <Die />;
      case 'unknown':
        return opening ? <QuestionOpen /> : <Question />;
      default:
        return opening ? <CeilBackgroundOpen /> : <CeilBackgroundCover />;
    }
  }

  return ceils.map((ceil, index) => (
    <div
      key={index}
      onMouseEnter={() => onMouseEnter(index)}
      onMouseDown={e => onMouseDown(e, index)}
      className="mine__ceil"
      index={index}
    >
      {renderContent(ceil)}
    </div>
  ));
}

const Die = () => (
  <>
    <CeilBackgroundOpen />
    <img alt="death" src={mineDeath} />
  </>
);
const MisFlagged = () => (
  <>
    <CeilBackgroundOpen />
    <img alt="misFlagged" src={misFlagged} />
  </>
);
const Flag = () => (
  <>
    <CeilBackgroundCover />
    <img alt="flag" src={flag} />
  </>
);
const MinesAround = ({ mines }) => (
  <>
    <CeilBackgroundOpen />
    <img alt="mines-around" src={getTextImg(mines)} />
  </>
);
const Question = () => (
  <>
    <CeilBackgroundCover />
    <img alt="question" src={question} />
  </>
);
const QuestionOpen = () => (
  <>
    <CeilBackgroundOpen />
    <img alt="question" src={question} />
  </>
);
const Mine = () => (
  <>
    <CeilBackgroundOpen />
    <img alt="mine" src={mine} />
  </>
);

const CeilBackgroundCover = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  border-left: rgb(245, 245, 245) solid 2px;
  border-top: rgb(245, 245, 245) solid 2px;
  border-right: rgb(128, 128, 128) solid 2px;
  border-bottom: rgb(128, 128, 128) solid 2px;
`;
const CeilBackgroundOpen = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  border-left: rgb(128, 128, 128) solid 1px;
  border-top: rgb(128, 128, 128) solid 1px;
`;

export default styled(MineSweeperView)`
  display: inline-block;
  img {
    pointer-events: none;
  }
  .mine__drop-downs {
    position: absolute;
    display: flex;
    height: 20px;
  }
  .mine__drop-down {
    position: relative;
    z-index: 1;
  }
  .mine__drop-down__title {
    padding: 0 5px;
    height: 100%;
    line-height: 20px;
    font-size: 11px;
    color: white;
    background-color: #1660e8;
  }
  .mine__drop-down__menu {
    background-color: white;
    position: absolute;
    box-shadow: 2px 2px 1px rgb(100, 100, 100);
    border: 1px solid gray;
    padding: 2px;
    display: grid;
    grid-template-columns: 18px auto auto 15px;
    line-height: 18px;
    font-size: 11px;
  }
  .mine__drop-down__row {
    display: contents;
    &:hover > * {
      background: #e99f17;
      filter: invert(100%);
    }
  }
  .mine__drop-down__separator {
    grid-column: 1 / 5;
    height: 1px;
    background-color: gray;
    margin: 3px 1px;
  }
  .mine__drop-down__check {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .mine__drop-down__arrow {
  }
  .mine__drop-down__hot-key {
    padding-left: 5px;
  }
  .mine__drop-down__text {
    white-space: nowrap;
  }
  .mine__top-bar {
    position: relative;
    display: flex;
    height: 20px;
    background-color: rgb(236, 233, 216);
  }
  .mine__top-bar__text {
    padding: 0 5px;
    height: 100%;
    line-height: 20px;
    font-size: 11px;
    &:hover {
      color: ${({ platform }) => (platform === 'desktop' ? '#FFF' : '#000')};
      background-color: ${({ platform }) =>
        platform === 'desktop' ? '#0b61ff' : 'transparent'};
    }
  }
  .mine__content {
    border-left: rgb(245, 245, 245) solid 3px;
    border-top: rgb(245, 245, 245) solid 3px;
    background-color: rgb(192, 192, 192);
    padding: 5px;
  }
  .mine__score-bar {
    height: 34px;
    border-radius: 1px;
    border-top: rgb(128, 128, 128) solid 2px;
    border-left: rgb(128, 128, 128) solid 2px;
    border-right: rgb(245, 245, 245) solid 2px;
    border-bottom: rgb(245, 245, 245) solid 2px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 7px 3px 4px;
  }
  .mine__digits__outer {
    width: 40px;
    height: 24px;
    border-width: 0 1px 1px 0;
    border-style: solid;
    border-color: #fff;
    text-align: right;
  }
  .mine__face__outer {
    width: 24px;
    height: 24px;
    border-top: 1px solid rgb(128, 128, 128);
    border-left: 1px solid rgb(128, 128, 128);
    border-radius: 2px;
    transform: translateX(1px);
  }
  .mine__face {
    border-radius: 2px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(192, 192, 192);
    border-width: 2px;
    border-style: solid;
    border-color: rgb(245, 245, 245) rgb(128, 128, 128) rgb(128, 128, 128)
      rgb(245, 245, 245);
    outline: none;
    &:active:hover {
      border-width: 1px;
      border-color: rgb(128, 128, 128);
      img {
        transform: translate(1px, 1px);
      }
      img:nth-child(1) {
        display: none;
      }
      img:nth-child(2) {
        display: block;
      }
    }
    img:nth-child(2) {
      display: none;
    }
  }
  .mine__content__inner {
    display: grid;
    grid-template-columns: repeat(${({ columns }) => columns}, 16px);
    grid-template-rows: repeat(${({ rows }) => rows}, 16px);
    border-top: rgb(128, 128, 128) solid 3px;
    border-left: rgb(128, 128, 128) solid 3px;
    border-right: rgb(245, 245, 245) solid 3px;
    border-bottom: rgb(245, 245, 245) solid 3px;
  }
  .mine__ceil {
    position: relative;
    img {
      position: absolute;
      width: 16px;
      height: 16px;
    }
  }
`;
