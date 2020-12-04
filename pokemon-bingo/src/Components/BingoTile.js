import '../Stylesheets/BingoTile.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faTint, faFire, faLeaf, faEye } from '@fortawesome/free-solid-svg-icons';

class BingoTile extends React.Component {
  render() {
    const selectedBy = {
      'player1': this.props.selectedByPlayer1,
      'player2': this.props.selectedByPlayer2,
      'player3': this.props.selectedByPlayer3,
      'player4': this.props.selectedByPlayer4,
    }
    const playerColors = {
      'player1': 'player-1',
      'player2': 'player-2',
      'player3': 'player-3',
      'player4': 'player-4',
    }
    const selected = this.props.selected ? 'bingo-tile-selected' : '';
    return (
      <td className={`bingo-tile ${selected}`} onClick={this.props.onTileClick}>
        {
          this.props.marked && 
          <FontAwesomeIcon icon={faBullseye} className="bingo-tile-marker" />
        }

        <div className="bingo-tile-selection-container">
          {
            selectedBy.player1 &&
            <FontAwesomeIcon icon={faTint} className={`bingo-tile-${playerColors.player1} bingo-tile-player1`} />
          }
          {
            selectedBy.player2 &&
            <FontAwesomeIcon icon={faFire} className={`bingo-tile-${playerColors.player2} bingo-tile-player2`} />
          }
          {
            selectedBy.player3 &&
            <FontAwesomeIcon icon={faLeaf} className={`bingo-tile-${playerColors.player3} bingo-tile-player3`} />
          }
          {
            selectedBy.player4 &&
            <FontAwesomeIcon icon={faEye} className={`bingo-tile-${playerColors.player4} bingo-tile-player4`} />
          }
        </div>
        
        {this.props.value}
      </td>
    );
  }
}

export default BingoTile;