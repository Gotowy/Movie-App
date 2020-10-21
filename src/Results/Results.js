import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getMovieList,
  getGenreList,
  setGenre,
  setSorting,
  setPage,
  resetApp,
} from "../store/actions.js";
import err from "./error.png";
import powered from "../powered-green.png";
import "./Results.css";

class Results extends Component {
  state = {
    requestType: "discover", //'discover' or 'search'
    //genres: [],

    //BASIC URL ELEMENTS OF REQUEST
    baseUrl: {
      discover: "https://api.themoviedb.org/3/discover/movie?",
      search: "https://api.themoviedb.org/3/search/movie?query=",
      genre: "https://api.themoviedb.org/3/genre/movie/list?",
      poster: "https://image.tmdb.org/t/p/w185/",
    },

    //URL ELEMENTS FOR DISCOVER REQUEST TYPE
    sorting: {
      popularity: "&sort_by=vote_count.desc",
      score: "&vote_count.gte=550&sort_by=vote_average.desc",
      trendy: "&sort_by=popularity.desc",
    },
  };

  getMovieList = () => {
    const sorting = this.state.sorting[this.props.sorting];
    const genre = `&with_genres=${this.props.genre.id}`;
    const page = `&page=${this.props.page}`;
    let request = "";

    switch (this.state.requestType) {
      case "discover":
        request =
          this.state.baseUrl.discover +
          genre +
          sorting +
          page +
          this.props.language +
          this.props.apiKey;
        break;
      case "search":
        request =
          this.state.baseUrl.search +
          this.props.search + //needs to be right after baseUrl variable
          page +
          this.props.language +
          this.props.apiKey;
        break;
      default:
        request = "";
        break;
    }
    this.addActivePage();
    this.props.getMovieList(request);
  };

  getGenreList = () => {
    const request =
      this.state.baseUrl.genre + this.props.language + this.props.apiKey;
    this.props.getGenreList(request);
  };

  selectGenre = (e) => {
    const option = e.target.selectedOptions[0];
    const genre = { id: option.id, name: option.value };
    this.removeActivePage();
    this.props.setGenre(genre);
    this.props.setPage(1);
    this.setState(
      {
        requestType: "discover",
      },
      () => {
        this.getMovieList();
      }
    );
    this.props.clearSearching();
    document.querySelector(".genres").classList.remove("grey");
  };

  sort = (e) => {
    const sorting = e.target.selectedOptions[0].value;
    this.removeActivePage();
    this.props.setSorting(sorting);
    this.props.setPage(1);
    setTimeout(() => this.getMovieList(), 0);
  };

  getPage = (number) => {
    this.removeActivePage();
    this.props.setPage(number);
    setTimeout(() => {
      this.getMovieList();
      window.scrollTo(0, 0);
    }, 0);
  };

  addActivePage = () => {
    const pageClass = `.page${this.props.page}`;
    const page = document.querySelector(pageClass);
    if (page) page.classList.add("active");
  };

  removeActivePage = () => {
    const pageClass = `.page${this.props.page}`;
    const page = document.querySelector(pageClass);
    if (page) page.classList.remove("active");
  };

  componentDidMount() {
    //The main logo clicked with Result component NOT mounted (discover request)
    if (this.props.resetNeeded) this.props.resetApp();
    //The main logo not clicked
    else {
      //Discover request
      if (this.props.search === "") {
        if (this.props.genre.name !== "Gatunek") {
          document.querySelector(".genres").classList.remove("grey");
          document.querySelector(".sorting").value = this.props.sorting;
        }
        //Search request
      } else {
        this.props.resetApp();
        //document.querySelector(".sorting").setAttribute("disabled", true);
        document.querySelector(".sorting").classList.add("disabled"); //instead of the line of code above
        this.setState({ requestType: "search" });
      }
    }
    if (!this.props.genres.lenght) this.getGenreList();
    if (!this.props.movies.lenght) setTimeout(() => this.getMovieList(), 0);
  }

  componentDidUpdate(prevProps) {
    //The main logo clicked with Result component mounted (discover request)
    if (this.props.resetNeeded) {
      this.props.resetApp();
      setTimeout(() => this.getMovieList(), 0);
    }
    //Changing input in the search bar
    if (prevProps.search !== this.props.search) {
      this.removeActivePage();
      this.props.setPage(1);
      //When the search bar gets empty
      if (!this.props.search) {
        this.setState({ requestType: "discover" });
        //document.querySelector(".sorting").removeAttribute("disabled");
        document.querySelector(".sorting").classList.remove("disabled"); //instead of the line of code above
        document.querySelector(".sorting").value = this.props.sorting;
        //When the search bar stops being empty
      } else if (!prevProps.search) {
        this.props.setGenre({ id: "", name: "Gatunek" });
        this.setState({ requestType: "search" });
        document.querySelector(".genres").value = "Gatunek";
        document.querySelector(".genres").classList.add("grey");
        //document.querySelector(".sorting").setAttribute("disabled", true);
        document.querySelector(".sorting").classList.add("disabled"); //instead of the line of code above
        this.props.setSorting("popularity");
      }
      setTimeout(() => this.getMovieList(), 0);
    }
  }

  render() {
    const { genres } = this.props;
    const genreList = genres.map((genre) => {
      return (
        <option value={genre.name} key={genre.id} id={genre.id}>
          {genre.name}
        </option>
      );
    });

    const { movies } = this.props;
    const movieList =
      movies.length || this.props.search === "" ? (
        <div className="movieList">
          {movies.map((movie) => {
            return (
              <div className="movie" key={movie.id} id={movie.id}>
                <Link to={`/netfilmoteka/movies/${movie.id}`}>
                  <img
                    alt={movie.title}
                    onError={(e) => {
                      e.target.onError = null;
                      e.target.src = err;
                    }}
                    src={
                      movie.poster_path
                        ? this.state.baseUrl.poster + movie.poster_path
                        : "error"
                    }
                  />
                </Link>
                <div className="score">
                  <div>
                    <i className="fa fa-star"></i>&nbsp;
                    {movie.vote_average}
                  </div>
                </div>

                <div className="title">
                  <Link to={`/netfilmoteka/movies/${movie.id}`}>
                    {movie.title}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="noResults">
          <br />
          Brak filmów spełniających kryteria
        </div>
      );

    const { pages } = this.props;
    const pageList = [];
    if (pages > 1) {
      for (let i = 1; i <= pages; i++) {
        let classes =
          i === this.props.page ? `page page${i} active` : `page page${i}`;
        pageList.push(
          <Link to={"/netfilmoteka/"} key={i} onClick={() => this.getPage(i)}>
            <div className={classes}>{i}</div>
          </Link>
        );
      }
    }

    return (
      <div>
        <div className="results">
          <nav>
            <form>
              <select
                className="genres grey"
                defaultValue={this.props.genre.name}
                onChange={this.selectGenre}
              >
                <option value="Gatunek" disabled hidden>
                  Gatunek
                </option>
                <option value="wszystkie">Wszystkie gatunki</option>
                {genreList}
              </select>

              <select className="sorting" onChange={this.sort}>
                <option value="popularity">Najpopularniejsze</option>
                <option value="score">Najwyżej oceniane</option>
                <option value="trendy">Obecnie na czasie</option>
              </select>
            </form>
          </nav>

          <main>{movieList}</main>

          <nav className="pages">{pageList}</nav>
        </div>
        <footer>
          <img className="powered" src={powered} alt="powered"></img>
        </footer>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    apiKey: state.apiKey,
    language: state.language,
    movies: state.movies,
    genres: state.genres,
    genre: state.genre,
    sorting: state.sorting,
    page: state.page,
    pages: state.pages,
    resetNeeded: state.resetNeeded,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getMovieList: (request) => dispatch(getMovieList(request)),
    getGenreList: (request) => dispatch(getGenreList(request)),
    setGenre: (genre) => dispatch(setGenre(genre)),
    setSorting: (sorting) => dispatch(setSorting(sorting)),
    setPage: (page) => dispatch(setPage(page)),
    resetApp: () => dispatch(resetApp()),
  };
};

export default connect(mapState, mapDispatch)(Results);
