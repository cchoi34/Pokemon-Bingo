import '../Stylesheets/Home.css';
import BingoBoard from './BingoBoard';
import Rules from './Rules';

function Home() {
  return (
    <div className="home home-body">
      <h1>Home</h1>
      <BingoBoard />
      <Rules />
    </div>
  );
}

export default Home;