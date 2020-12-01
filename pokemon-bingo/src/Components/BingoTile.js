import '../Stylesheets/BingoTile.css';
import React from 'react';

class BingoTile extends React.Component {
  render() {
    return (
      <td className='bingo-tile'>
        {this.props.value}
      </td>
    );
  }
}

export default BingoTile;