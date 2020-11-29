import '../Stylesheets/BingoBoard.css';
import React from 'react';
import BingoTile from './BingoTile';

class BingoBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tiles: [
                [ '', '', '', '', ''],
                [ '', '', '', '', ''],
                [ '', '', '', '', ''],
                [ '', '', '', '', ''],
                [ '', '', '', '', ''],
            ],
        }
        this.populateData = this.populateData.bind(this);
    }
    
    componentDidMount() {
        const data = this.populateData();
        
        this.setState({
            tiles: data,
        })
    }

    populateData() {
        const data = [];
        for (let i = 0; i < 5; i++) {
            const row = [];
            for (let j = 0; j < 5; j++) {
                const offset = i * 5;
                const value = offset + (j + 1);
                row.push(value.toString());
            }
            data.push(row);
        }
        return data;
    }

    render() {
        return (
            <table className='bingo-board center'>
                {
                    this.state.tiles.map((row) => {
                        let newRow = 
                            <tr>
                                {
                                    row.map((value) => {
                                        return <BingoTile value={value} />;
                                    })
                                }
                            </tr>;
                        return newRow;       
                    })
                }          
            </table>
        )
    }
}

export default BingoBoard;