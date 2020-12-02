import '../Stylesheets/BingoTile.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';

class BingoTile extends React.Component {
  render() {
    const selected = this.props.selected ? 'bingo-tile-selected' : 'bingo-tile-deselected'
    return (
      <td className={`bingo-tile ${selected}`} onClick={this.props.onTileClick}>
        {
          this.props.marked && 
          <FontAwesomeIcon icon={faBullseye} className="bingo-tile-marker" />
        }
        {this.props.value}
      </td>
    );
  }
}

export default BingoTile;