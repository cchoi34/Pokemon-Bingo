import '../Stylesheets/BingoTile.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';

class BingoTile extends React.Component {
  render() {
    return (
      <td className='bingo-tile'>
        {
          this.props.marked && 
          <FontAwesomeIcon icon={faBullseye} className="bingo-tile-icon" />
        }
        {this.props.value}
      </td>
    );
  }
}

export default BingoTile;