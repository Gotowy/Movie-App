import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Results from "./Results/Results.js";
import Movie from "./Movie/Movie.js";
import { connect } from "react-redux";
import { callReset } from "./store/actions.js";

class App extends Component {
  state = {
    search: "",
  };

  handleChange = (e) => {
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
            <nav>
              <Link
                to="/netfilmoteka/"
                onClick={() => {
                  this.clearSearching();
                  this.props.callReset();
                  window.scrollTo(0, 0);
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
                  onChange={(e) => this.handleChange(e)}
                ></input>
              </div>
            </nav>
          </header>

          <Route
            exact
            path="/netfilmoteka/"
            render={() => (
              <Results
                search={this.state.search}
                clearSearching={this.clearSearching}
              />
            )}
          />
          <Route path="/netfilmoteka/movies/:movie_id" component={Movie} />
        </div>
      </BrowserRouter>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    callReset: () => dispatch(callReset()),
  };
};

export default connect(null, mapDispatch)(App);
