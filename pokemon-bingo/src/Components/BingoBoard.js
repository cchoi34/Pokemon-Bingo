import '../Stylesheets/BingoBoard.css';
import React from 'react';
import firebase from 'firebase';
import BingoTile from './BingoTile';
import BoardButton from './BoardButton';
import ShareLink from './ShareLink';

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
    console.log("ref: ", ref);
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
    });
  }

  resetEmptyBoardMessage() {
    window.setTimeout(() => {
      this.setState({
        tiles: this.state.tiles,
        tasks: this.state.tasks,
        shareLink: this.state.shareLink,
        emptyBoardMessage: false,
      })
    }, 2000)
  }

  render() {
    const newBoard = 'New Board';
    const shareBoard = 'Share Board';
    const testingUrl = "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input";
    return (
      <div>
        <BoardButton name={newBoard} onClick={this.getTilesFromTasks} />
        <BoardButton name={shareBoard} onClick={this.shareBoardButtonClick} />
        {
          this.state.shareLink && <ShareLink url={testingUrl} />
        }
        {
          this.state.emptyBoardMessage && <ShareLink />
        }
        <table className='bingo-board center'>
          <tbody>
            {
              this.state.tiles.map((row, index) => {
                let newRow = 
                  <tr key={index}>
                    {
                      row.map((value, index) => {
                        return <BingoTile value={value} key={index} />;
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