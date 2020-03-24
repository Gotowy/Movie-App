import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import err from "./error.png";
import "./Results.css";
import powered from "../powered-green.png";

class Results extends Component {
  state = {
    //BASIC URL ELEMENTS OF REQUEST
    baseUrl: {
      discover: "https://api.themoviedb.org/3/discover/movie?",
      search: "https://api.themoviedb.org/3/search/movie?query=",
      genre: "https://api.themoviedb.org/3/genre/movie/list?",
      poster: "http://image.tmdb.org/t/p/w185/"
    },
    requestType: "", //'discover' or 'search'
    page: "", //current result page
    //URL ELEMENTS FOR DISCOVER REQUEST TYPE
    sortingCriterium: {
      popularity: "&sort_by=vote_count.desc",
      score: "&vote_count.gte=200&sort_by=vote_average.desc",
      trendy: "&sort_by=popularity.desc"
    },
    sort: "&sort_by=vote_count.desc", //current sorting option
    genre: "", //current genre filter
    //LISTS OF REQUEST RESULTS
    genres: [],
    movies: [],
    //PAGE VARIABLES
    pageNumber: 1, //serves establishing an active class for link representing current page number
    maxPages: 10, //SET MAXIMUM AMOUNT of pages for movies result (one page contains up to 20 movies)
    pages: null //how many pages given result includes
  };

  getMovieList = () => {
    let request = "";

    switch (this.state.requestType) {
      case "discover":
        request =
          this.state.baseUrl.discover +
          this.state.genre +
          this.state.sort +
          this.state.page +
          this.props.language +
          this.props.apiKey;
        break;
      case "search":
        request =
          this.state.baseUrl.search +
          this.props.search +
          this.state.page +
          this.props.language +
          this.props.apiKey;
        break;
      default:
        request = "";
        break;
    }

    axios.get(request).then(res => {
      const maxPages = this.state.maxPages;
      const totalPages = res.data.total_pages;
      const pages = totalPages >= maxPages ? maxPages : totalPages;

      this.setState({ pages, movies: res.data.results });
      this.addActive();
    });
  };

  getGenreList = () => {
    const request =
      this.state.baseUrl.genre + this.props.language + this.props.apiKey;
    axios.get(request).then(res => {
      this.setState({ genres: res.data.genres });
    });
  };

  selectGenre = e => {
    const genre = `&with_genres=${e.target.selectedOptions[0].id}`;
    this.removeActive();
    this.setState(
      {
        genre,
        requestType: "discover",
        page: "&page=1",
        pageNumber: 1
      },
      () => this.getMovieList()
    );
    this.props.clearSearching();
    document.querySelector(".genres").classList.remove("grey");
  };

  sort = e => {
    const sort = e.target.selectedOptions[0].value;
    this.removeActive();
    this.setState(
      {
        sort: this.state.sortingCriterium[sort],
        page: "&page=1",
        pageNumber: 1
      },
      () => this.getMovieList()
    );
  };

  getPage = number => {
    const page = `&page=${number}`;
    this.removeActive();
    this.setState({ page, pageNumber: number }, () => {
      this.getMovieList();
    });
    window.scrollTo(0, 0);
  };

  addActive = () => {
    const pageClass = `.page${this.state.pageNumber}`;
    const page = document.querySelector(pageClass);
    if (page) page.classList.add("active");
  };

  removeActive = () => {
    const pageClass = `.page${this.state.pageNumber}`;
    const page = document.querySelector(pageClass);
    if (page) page.classList.remove("active");
  };

  componentDidMount() {
    if (this.props.search === "") {
      this.setState({ requestType: "discover" }, () => this.getMovieList());
    } else {
      this.setState(
        {
          requestType: "search"
        },
        () => this.getMovieList()
      );
      document.querySelector(".sort").setAttribute("disabled", true);
    }
    this.getGenreList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.search !== this.props.search) {
      this.removeActive();
      if (this.props.search === "") {
        this.setState(
          {
            requestType: "discover",
            page: "&page=1",
            pageNumber: 1
          },
          () => this.getMovieList()
        );
        document.querySelector(".sort").removeAttribute("disabled");
      } else {
        this.setState(
          {
            requestType: "search",
            page: "&page=1",
            pageNumber: 1,
            genre: ""
          },
          () => this.getMovieList()
        );
        document.querySelector(".genres").value = "gatunek";
        document.querySelector(".genres").classList.add("grey");
        document.querySelector(".sort").setAttribute("disabled", true);
      }
    }
  }

  render() {
    const { genres } = this.state;
    const genreList = genres.map(genre => (
      <option value={genre.name} key={genre.id} id={genre.id}>
        {genre.name}
      </option>
    ));

    const { movies } = this.state;
    const movieList =
      movies.length || this.props.search === "" ? (
        <div className="movieList">
          {movies.map(movie => {
            const linkParameter = {
              pathname: `/movie-app/movies/${movie.id}`,
              state: {
                search: this.props.search,
                language: this.props.language,
                apiKey: this.props.apiKey
              }
            };
            return (
              <div className="movie" key={movie.id} id={movie.id}>
                <Link to={linkParameter}>
                  <img
                    alt={movie.title}
                    onError={e => {
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
                  <Link to={linkParameter}>{movie.title}</Link>
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

    const { pages } = this.state;
    const pageList = [];
    if (pages > 1) {
      for (let i = 1; i <= pages; i++) {
        let classes = i === 1 ? `page page${i} active` : `page page${i}`;
        pageList.push(
          <Link to={"/movie-app/"} key={i} onClick={() => this.getPage(i)}>
            <div className={classes}>{i}</div>
          </Link>
        );
      }
    }

    return (
      <div>
        <div className="results">
          <form>
            <select
              className="genres grey"
              defaultValue="gatunek"
              onChange={this.selectGenre}
            >
              <option value="gatunek" disabled hidden>
                Gatunek
              </option>
              <option value="wszystkie">Wszystkie gatunki</option>
              {genreList}
            </select>

            <select className="sort" onChange={this.sort}>
              <option value="popularity">Najpopularniejsze</option>
              <option value="score">Najwyżej oceniane</option>
              <option value="trendy">Obecnie na czasie</option>
            </select>
          </form>

          {movieList}

          <div className="pages">{pageList}</div>
        </div>
        <footer>
          <img className="powered" src={powered} alt="powered"></img>
        </footer>
      </div>
    );
  }
}

export default Results;
