import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Results from "./Results/Results.js";
import Movie from "./Movie/Movie.js";

//import Redirector from "./Redirector/Redirector.js";

class App extends Component {
  state = {
    search: "",
    language: "&language=pl",
    apiKey: process.env.REACT_APP_API_KEY
  };

  handleChange = e => {
    this.setState({ search: e.target.value });
    window.scrollTo(0, 0);
  };

  clearSearching = () => {
    this.setState({ search: "" });
    document.querySelector("#search").value = "";
  };

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <header>
            <Link
              to="/movie-app/"
              onClick={() => {
                window.scrollTo(0, 0);
                this.clearSearching();
              }}
            >
              <div className="logo">
                <span className="net">net</span>Filmoteka
              </div>
            </Link>
            <div className="search">
              <input
                type="text"
                id="search"
                placeholder="Nazwa filmu..."
                onChange={e => this.handleChange(e)}
              ></input>
            </div>
          </header>

          <Route
            exact
            path="/movie-app/"
            render={() => (
              <Results
                apiKey={this.state.apiKey}
                language={this.state.language}
                search={this.state.search}
                clearSearching={this.clearSearching}
              />
            )}
          />
          <Route
            path="/movie-app/movies/:movie_id"
            component={Movie}
            /*render={() => (
              <Movie
                apiKey={this.state.apiKey}
                language={this.state.language}
              />
            )}*/
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
