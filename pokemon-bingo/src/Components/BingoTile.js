import '../Stylesheets/BingoTile.css';
import React from 'react';

class BingoTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }

    componentDidMount() {
        this.setState({
            value: this.props.value,
        })
    }

    render() {
        return (
            <td className='bingo-tile'>
                {this.state.value}
            </td>
        );
    }
}

export default BingoTile;