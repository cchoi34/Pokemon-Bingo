import '../Stylesheets/RulesList.css';

function RulesList() {
  return (
    <div className="rules">
      <div className='rules-container'>
        <h3>Setup</h3>
        <ul className='rules-list'>
            <li>&#8250; Grab a copy of Pokemon Sword or Shield</li>
            <li>&#8250; Grab a friend with another copy (or you can play by yourself)</li>
            <li>&#8250; Choose a Bingo Board. These are random.</li>
            <li>&#8250; Share the Bingo board with other participating friends over something like Discord!</li>
        </ul>

        <h3>Rules</h3>
        <ul className='rules-list'>
            <li>&#8250; First player to get a BINGO (complete a row, column, or diagonal) wins.</li>
            <li>&#8250; Completing a task allows you to click and mark a tile. Any number of tiles can be marked.</li>
            <li>&#8250; Tasks can be completed by any means necessary, within normal playthrough means.</li>
            <li>&#8250; Tasks need to be completed as a single player. Any help from other save files is not legal.</li>
            <li>&#8250; Changing date/time or other system settings is allowed.</li>
            <li>&#8250; All items/pokemon/objects must be held until the end of the competition. Ex: Using a Dawn Stone to evolve to a Froslass means you need another Dawn Stone to check off that task. Individual pokemon are exempt, and the Pokedex can be used to verify owned Pokemon.</li>
        </ul>
      </div>
    </div>
  );
}

export default RulesList;