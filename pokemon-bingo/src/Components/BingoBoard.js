import '../Stylesheets/BingoBoard.css';
import React from 'react';
import firebase from 'firebase';
import BingoTile from './BingoTile';
import BoardButton from './BoardButton';
import ShareLink from './ShareLink';
import BingoBoardMarker from './BingoBoardMarker';

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
      tasks: [],
      shareLink: false, 
      emptyBoardMessage: false,
      markedTiles: [],
      selectedTiles: [],
    }
    this.formatTilesForState = this.formatTilesForState.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.getTilesFromTasks = this.getTilesFromTasks.bind(this);
    this.gotDataOnTasks = this.gotDataOnTasks.bind(this);
    this.gotDataOnSingleBoard = this.gotDataOnSingleBoard.bind(this);
    this.errData = this.errData.bind(this);
    this.saveCurrentBoard = this.saveCurrentBoard.bind(this);
    this.getBoardById = this.getBoardById.bind(this);
    this.saveCurrentBoard = this.saveCurrentBoard.bind(this);
    this.resetEmptyBoardMessage = this.resetEmptyBoardMessage.bind(this);
    this.shareBoardButtonClick = this.shareBoardButtonClick.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.markMarkerTiles = this.markMarkerTiles.bind(this);
    this.isTileMarked = this.isTileMarked.bind(this);
    this.isTileSelected = this.isTileSelected.bind(this);
    this.onTileClick = this.onTileClick.bind(this);
  }
  
  componentDidMount() {
    if (this.props.id) {
      this.getBoardById(this.props.id);
    } else if (!this.props.id) {
      this.getTasks();
    }
  }

  getBoardById(id) {
    const database = firebase.database();
    const ref = database.ref(`/boards/${id}`);
    ref.on('value', this.gotDataOnSingleBoard, this.errData)
  }
  
  getTasks() {
    const database = firebase.database();
    const ref = database.ref('/1RPNE960UfeR4-axl8g6qVSK68UemxsNgFnnnhbjtfNI/Tasks');
    ref.on('value', this.gotDataOnTasks, this.errData);
  }

  gotDataOnSingleBoard(data) {
    const result = data.val();
    if (result) {
      this.setState({
        tiles: result,
        tasks: this.state.tasks,
        shareLink: this.state.shareLink,
        emptyBoardMessage: this.state.emptyBoardMessage,
        markedTiles: this.state.markedTiles,
        selectedTiles: this.state.selectedTiles,
      });
    }
  }
  
  gotDataOnTasks(data) {
    const result = data.val();
    this.setState({
      tiles: this.state.tiles,
      tasks: result,
      shareLink: this.state.shareLink,
      emptyBoardMessage: this.state.emptyBoardMessage,
      markedTiles: this.state.markedTiles,
      selectedTiles: this.state.selectedTiles,
    });
  }
  
  errData(error) {
    console.log("error grabbing data from firebase: ", error);
  }

  getTilesFromTasks() {
    let randomNums = [];
    if (this.state.tasks.length >= 25) { // has enough for a bingo board
      let taskIndexes = this.state.tasks.map((value, index) => {
        return index;
      });

      for (let i = 0; i < 25; i++) {
        const index = Math.floor(Math.random() * taskIndexes.length);
        const chosenNum = taskIndexes.splice(index, 1);
        randomNums.push(chosenNum[0]);
      }
    }
    
    let newTiles = this.state.tiles;
    if (randomNums.length >= 25) {
      newTiles = randomNums.map((num) => {
        return this.state.tasks[num];
      })
    }
    newTiles = this.formatTilesForState(newTiles);

    this.setState({
      tiles: newTiles,
      tasks: this.state.tasks,
      shareLink: this.state.shareLink,
      emptyBoardMessage: this.state.emptyBoardMessage,
      markedTiles: this.state.markedTiles,
      selectedTiles: this.state.selectedTiles,
    });
  }

  formatTilesForState(tiles) {
    const data = [];
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        const offset = i * 5;
        const value = offset + j;
        row.push(tiles[value].taskName);
      }
      data.push(row);
    }
    return data;
  }

  saveCurrentBoard() {
    const currentBoard = this.state.tiles;
    const isCurrentBoardEmpty = currentBoard[0][0] === ''; 
    if (!isCurrentBoardEmpty) {
      const database = firebase.database();
      const ref = database.ref('/boards');
      const newRef = ref.push(currentBoard);
      return newRef.key;
    }
    return null;
  }

  shareBoardButtonClick() {
    const id = this.saveCurrentBoard();
    if (!id) {
      this.setState({
        tiles: this.state.tiles,
        tasks: this.state.tasks,
        shareLink: this.state.shareLink,
        emptyBoardMessage: true,
        markedTiles: this.state.markedTiles,
        selectedTiles: this.state.selectedTiles,
      }, this.resetEmptyBoardMessage);
      return;
    }

    const urlState = {
      'id': id,
    }

    window.history.pushState(urlState, '', `/board/${id}`);

    this.setState({
      tiles: this.state.tiles,
      tasks: this.state.tasks,
      shareLink: true,
      emptyBoardMessage: this.state.emptyBoardMessage,
      markedTiles: this.state.markedTiles,
      selectedTiles: this.state.selectedTiles,
    });
  }

  resetEmptyBoardMessage() {
    window.setTimeout(() => {
      this.setState({
        tiles: this.state.tiles,
        tasks: this.state.tasks,
        shareLink: this.state.shareLink,
        emptyBoardMessage: false,
        markedTiles: this.state.markedTiles,
        selectedTiles: this.state.selectedTiles,
      })
    }, 2000)
  }

  markMarkerTiles(tileIndexes) {
    if (tileIndexes) {
      this.setState({
        tiles: this.state.tiles,
        tasks: this.state.tasks,
        shareLink: this.state.shareLink,
        emptyBoardMessage: this.state.emptyBoardMessage,
        markedTiles: tileIndexes,
        selectedTiles: this.state.selectedTiles,
      });
    } 
  }

  onMarkerClick(id) {
    let tileIndexes = null;
    switch(id) {
      case 'C1':
        tileIndexes = [
          [0, 0],
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4],
        ];
        break;
      case 'C2':
        tileIndexes = [
          [1, 0],
          [1, 1],
          [1, 2],
          [1, 3],
          [1, 4],
        ];
        break;
      case 'C3':
        tileIndexes = [
          [2, 0],
          [2, 1],
          [2, 2],
          [2, 3],
          [2, 4],
        ];
        break;
      case 'C4':
        tileIndexes = [
          [3, 0],
          [3, 1],
          [3, 2],
          [3, 3],
          [3, 4],
        ];
        break;
      case 'C5':
        tileIndexes = [
          [4, 0],
          [4, 1],
          [4, 2],
          [4, 3],
          [4, 4],
        ];
        break;

      case 'R1':
        tileIndexes = [
          [0, 0],
          [1, 0],
          [2, 0],
          [3, 0],
          [4, 0],
        ];
        break;
      case 'R2':
        tileIndexes = [
          [0, 1],
          [1, 1],
          [2, 1],
          [3, 1],
          [4, 1],
        ];
        break;
      case 'R3':
        tileIndexes = [
          [0, 2],
          [1, 2],
          [2, 2],
          [3, 2],
          [4, 2],
        ];
        break;
      case 'R4':
        tileIndexes = [
          [0, 3],
          [1, 3],
          [2, 3],
          [3, 3],
          [4, 3],
        ];
        break;
      case 'R5':
        tileIndexes = [
          [0, 4],
          [1, 4],
          [2, 4],
          [3, 4],
          [4, 4],
        ];
        break;

      case 'D1':
        tileIndexes = [
          [0, 0],
          [1, 1],
          [2, 2],
          [3, 3],
          [4, 4],
        ];
        break;
      case 'D2':
        tileIndexes = [
          [0, 4],
          [1, 3],
          [2, 2],
          [3, 1],
          [4, 0],
        ];
        break;
      
      default:
        break;
    }
    this.markMarkerTiles(tileIndexes);
  }

  isTileMarked(colIndex, rowIndex) {
    const markedTiles = this.state.markedTiles;
    let isMarked = false;
    if (markedTiles.length === 0) {
      return isMarked;
    }
    markedTiles.forEach((tile) => {
      if (tile[0] === colIndex && tile[1] === rowIndex) {
        isMarked = true;
      }
    });
    return isMarked;
  }

  isTileSelected(colIndex, rowIndex) {
    const selectedTiles = this.state.selectedTiles;
    let isSelected = false;
    let foundIndex = null;
    if (selectedTiles.length === 0) {
      return [isSelected, foundIndex];
    }
    for (let i = 0; i < selectedTiles.length; i++) {
      const tile = selectedTiles[i];
      if (tile[0] === colIndex && tile[1] === rowIndex) {
        isSelected = true;
        foundIndex = i;
        break;
      }
    }

    return [isSelected, foundIndex];
  }

  onTileClick(colIndex, rowIndex) {
    const selectedTiles = this.state.selectedTiles;
    const selectedTile = [colIndex, rowIndex];
    const isTileSelected = this.isTileSelected(colIndex, rowIndex);

    if (isTileSelected[0]) {
      selectedTiles.splice(isTileSelected[1], 1);
    } else if (!isTileSelected[0]) {
      selectedTiles.push(selectedTile);
    }

    this.setState({
      tiles: this.state.tiles,
      tasks: this.state.tasks,
      shareLink: this.state.shareLink,
      emptyBoardMessage: this.state.emptyBoardMessage,
      markedTiles: this.state.markedTiles,
      selectedTiles: selectedTiles,
    });
  }

  render() {
    const newBoard = 'New Board';
    const shareBoard = 'Share Board';
    return (
      <div className="bingo-board-container">
        <div className="bingo-board-button-container">
          <BoardButton name={newBoard} onClick={this.getTilesFromTasks} />
          <BoardButton name={shareBoard} onClick={this.shareBoardButtonClick} />
          {
            this.state.shareLink && <ShareLink filledBoard={true} />
          }
          {
            this.state.emptyBoardMessage && <ShareLink filledBoard={false} />
          }
        </div>
        <BingoBoardMarker onMarkerClick={this.onMarkerClick} /> 
        <table className='bingo-board center'>
          <tbody>
            {
              this.state.tiles.map((row, rowIndex) => {
                let newRow = 
                  <tr key={rowIndex} id={rowIndex} >
                    {
                      row.map((value, colIndex) => {
                        const marked = this.isTileMarked(colIndex, rowIndex);
                        const selected = this.isTileSelected(colIndex, rowIndex);
                        return <BingoTile 
                                  value={value} 
                                  key={colIndex} 
                                  id={colIndex} 
                                  marked={marked}
                                  selected={selected[0]}
                                  onTileClick={() => {
                                    console.log("clicked tile");
                                    this.onTileClick(colIndex, rowIndex);
                                  }}
                                  />;
                      })
                    }
                  </tr>;
                return newRow;       
              })
            }   
          </tbody>       
        </table>
      </div>
    )
  }
}

export default BingoBoard;