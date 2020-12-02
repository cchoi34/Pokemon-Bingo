import '../Stylesheets/BingoBoardMarker.css';
import React from 'react';

class BingoBoardMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topMarkers: ['D1', 'C1', 'C2', 'C3', 'C4', 'C5', 'D2'],
      sideMarkers: ['R1', 'R2', 'R3', 'R4', 'R5'],
    }
  }

  render() {
    return (
      <div className="bingo-board-marker-container">
        <div className="bingo-board-marker-top">
          {
            this.state.topMarkers.map((value, index) => {
              return <button key={index} id={value} onClick={() => {
                this.props.onMarkerClick(value);
              }}>{value}</button>
            })
          }
        </div>
        <div className="bingo-board-marker-side">
          {
            this.state.sideMarkers.map((value, index) => {
              return <button key={index} id={value} onClick={() => {
                this.props.onMarkerClick(value);
              }} >{value}</button>
            })
          }
        </div>
      </div>
    );
  }
}

export default BingoBoardMarker;