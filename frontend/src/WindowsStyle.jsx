import React from 'react';
import { Quit, WindowMinimise } from '../wailsjs/runtime/runtime';
import "./XP.css/XP-namespaced.css";
import "./XP.css/98-namespaced.css";
import "./classic-stylesheets/3.1-namespaced.scss";
import "./WindowsStyle98.css";
import "./WindowsStyle3.1.css";

export default function WindowsStyle({ children, windowTitleWidth, style }) {
    return (
        <div style={{ width: windowTitleWidth + (style === 0 ? -2 : 0) + (style === 1 ? -8 : 0)}} className="window active">
          <div className="title-bar active" style={{'--wails-draggable': 'drag'}}>
            { style === 2 && // Windows 3.1
              <div className="title-bar-buttons">
                <button data-control="" onDoubleClick={Quit}/>
              </div>
            }
            { style !== 2 && // Windows XP and 98
              <img src="data:image/png;base64,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" alt="Minesweeper" draggable="false" height="15px" width="15px" onDoubleClick={Quit} />
            }
            <div className="title-bar-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
              Minesweeper
            </div>
            { style !== 2 && // Windows XP and 98
              <div style={{flexGrow: 1}}></div>
            }
            { style !== 2 && // Windows XP and 98
              <div className="title-bar-controls">
                <button aria-label="Minimize" onClick={WindowMinimise} />
                <button aria-label="Maximize" style={{ opacity: style === 0 ? 0.5 : 1 }} disabled /> {/* doesn't work for 98.css and disable hover state for xp.css*/}
                <button aria-label="Close" onClick={Quit}/>
              </div>
            }
            { style === 2 && // Windows 3.1
              <div className="title-bar-buttons">
                <button data-minimize="" onClick={WindowMinimise} />
              </div>
            }
          </div>

          <div className="window-body" style={{ marginLeft: style === 0 ? 3: 0, marginRight: style === 0 ? 3: 0, marginTop: 0, marginBottom: 0 }}>
            {children}
          </div>
        </div>
    );
}