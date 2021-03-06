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
      userId: null,
      boardData: {},
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
    this.addPlayerToBoard = this.addPlayerToBoard.bind(this);
    this.addPlayerTilesToBoard = this.addPlayerTilesToBoard.bind(this);
    this.selectedByPlayer = this.selectedByPlayer.bind(this);
    this.getBoardData = this.getBoardData.bind(this);
    this.getPlayersOnBoard = this.getPlayersOnBoard.bind(this);
  }
  
  componentDidMount() {
    if (this.props.id) {
      this.getBoardById(this.props.id);
    } 
    this.getTasks();
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      this.setState({
        user: userData.username,
        userId: userData.id,
      }, () => {
        this.addPlayerToBoard(this.props.id);
      });
      this.getBoardData(this.props.id);
    }
  }

  addPlayerToBoard(boardId) {
    if (boardId && this.state.userId) {
      const database = firebase.database();
      const ref = database.ref('boards').child(boardId).child(this.state.userId);
      const playerCountRef = database.ref('boards').child(boardId);
      playerCountRef.orderByChild('playerId').once('value', (snapshot) => {
        let players = 0;
        snapshot.forEach((child) => {
          if (child.val().playerId) {
            players = players + 1;
          }
        });
        if (players < 4) {
          ref.set({
            'playerId': this.state.userId,
            'selectedTiles': this.state.selectedTiles,
          });
        }
      })
    }
  }

  addPlayerTilesToBoard(boardId) {
    if (boardId) {
      const userId = this.state.userId;
      if (userId) {
        const selectedTiles = this.state.selectedTiles;
        const playerData = {
          'playerId': userId,
          'selectedTiles': selectedTiles,
        }

        const database = firebase.database();
        const ref = database.ref('boards').child(boardId).child(userId);
        ref.set(playerData);
      }
    }
  }

  getPlayersOnBoard() {
    if (!this.props.id) return [];
    // const ref = firebase.database().ref('boards').child(this.props.id);
    //using state. If this doesn't work use firebase data instead
    const boardData = this.state.boardData;
    if (!boardData) return [];
    const players = Object.keys(boardData).filter((value) => {
      return value.startsWith('ID_');
    });
    return players;
  }

  getBoardData(boardId) {
    if (!boardId) return;
    const ref = firebase.database().ref('boards').child(boardId);
    // FINISH THOUGHT HERE
    ref.on('value', (snapshot) => {
      this.setState({
        boardData: snapshot.val(),
      })
    })
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

  gotDataOnTasks(data) {
    const result = data.val();
    this.setState({
      tasks: result,
    });
  }

  gotDataOnSingleBoard(data) {
    const result = data.val();
    if (result) {
      this.setState({
        tiles: result.board,
      });
    }
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
      const boardWithPlayers = {
        'board': currentBoard,
        'players': null,
      }
      const newRef = ref.push(boardWithPlayers);
      return newRef.key;
    }
    return null;
  }

  shareBoardButtonClick() {
    const id = this.saveCurrentBoard();
    if (!id) {
      this.setState({
        emptyBoardMessage: true,
      }, this.resetEmptyBoardMessage);
      return;
    }

    const urlState = {
      'id': id,
    }

    window.history.pushState(urlState, '', `/board/${id}`);
    this.addPlayerToBoard(id);

    this.setState({
      shareLink: true,
    });
  }

  resetEmptyBoardMessage() {
    window.setTimeout(() => {
      this.setState({
        emptyBoardMessage: false,
      })
    }, 2000)
  }

  markMarkerTiles(tileIndexes) {
    if (tileIndexes) {
      this.setState({
        markedTiles: tileIndexes,
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
          [0, 4],
          [1, 3],
          [2, 2],
          [3, 1],
          [4, 0],
        ];
        break;
      case 'D2':
        tileIndexes = [
          [0, 0],
          [1, 1],
          [2, 2],
          [3, 3],
          [4, 4],
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
      selectedTiles: selectedTiles,
    }, () => {
      this.addPlayerTilesToBoard(this.props.id);
    });
  }

  selectedByPlayer(playerId, colIndex, rowIndex) {
    const playerData = this.state.boardData[playerId];
    if (!playerData) return false;

    const tilesSelectedByPlayer = playerData.selectedTiles;
    if (!tilesSelectedByPlayer) return false;

    let isSelected = false;
    if (tilesSelectedByPlayer.length === 0) return isSelected;

    for (let i = 0; i < tilesSelectedByPlayer.length; i++) {
      const tile = tilesSelectedByPlayer[i];
      if (tile[0] === colIndex && tile[1] === rowIndex) {
        isSelected = true;
        break;
      }
    }
    return isSelected;
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
                        const playersOnBoard = this.getPlayersOnBoard();
                        let playersSelected = [false, false, false, false];
                        if (playersOnBoard.length > 0) {
                          playersOnBoard.forEach((playerId, index) => {
                            playersSelected[index] = this.selectedByPlayer(playerId, colIndex, rowIndex);
                          });
                        }
                        return <BingoTile 
                                  value={value} 
                                  key={colIndex} 
                                  id={colIndex} 
                                  marked={marked}
                                  selected={selected[0]}
                                  selectedByPlayer1={playersSelected[0]}
                                  selectedByPlayer2={playersSelected[1]}
                                  selectedByPlayer3={playersSelected[2]}
                                  selectedByPlayer4={playersSelected[3]}
                                  onTileClick={() => {
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