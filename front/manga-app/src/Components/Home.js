import { Helmet } from 'react-helmet';
import "../Styles/Home.css";

function Home(){
    return (
      <div className="Home">
        <Helmet>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Helmet>
        <div>
          <h1>
            Manga<i className="material-icons">filter_vintage</i>
          </h1>
          <p>Optimized Manga Experience</p>
        </div>
      </div>
    );
};

export default Home;
