import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Movie.css";
import err from "./error.png";
import powered from "../powered-green.png";

class Movie extends Component {
  state = {
    movieBaseUrl: "https://api.themoviedb.org/3/movie/",
    posterUrl: "",
    backdropUrl: "",
    movieInfo: {},
    director: "",
    screenplay: "",
    writer: ""
  };

  componentDidMount() {
    const id = this.props.match.params.movie_id;

    const movieRequest =
      this.state.movieBaseUrl +
      id +
      "?" +
      this.props.location.state.language +
      this.props.location.state.apiKey;

    const creditsRequest =
      this.state.movieBaseUrl +
      id +
      "/credits?" +
      this.props.location.state.language +
      this.props.location.state.apiKey;

    axios.get(movieRequest).then(res => {
      const posterUrl = res.data.poster_path
        ? `https://image.tmdb.org/t/p/w300/${res.data.poster_path}`
        : "none";
      const backdropUrl = res.data.backdrop_path
        ? `https://image.tmdb.org/t/p/original/${res.data.backdrop_path}`
        : "none";
      this.setState({
        movieInfo: res.data,
        posterUrl,
        backdropUrl
      });
    });

    axios.get(creditsRequest).then(res => {
      const name = job => {
        const member = res.data.crew.find(cast => cast.job === job);
        return member ? member.name : "Nieznany";
      };
      const director = name("Director");
      const screenplay = name("Screenplay");
      const writer = name("Writer");

      this.setState({
        director,
        screenplay,
        writer
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.props.history.push("/movie-app/");
    }
  }

  render() {
    const m = this.state.movieInfo;
    const year = new Date(m.release_date).getFullYear();
    const hours = Math.floor(m.runtime / 60);
    const minutes = m.runtime - hours * 60;

    return (
      <div
        className="movieBackdrop"
        style={{
          backgroundImage: `url(${this.state.backdropUrl})`
        }}
      >
        <div className="container1">
          <div className="container2">
            <div className="moviePoster leftPoster">
              <img
                src={this.state.posterUrl}
                alt={m.title}
                onError={e => {
                  e.target.onError = null;
                  e.target.src = err;
                }}
              />
            </div>
            <div className="movieInfo">
              <div className="movieHeader">
                <span>
                  <div className="movieTitle">
                    {m.title}
                    <span className="movieYear">
                      {" "}
                      {year ? `(${year})` : ""}
                    </span>
                  </div>
                  <div className="movieRuntime">
                    {hours}godz. {minutes}min.
                  </div>
                </span>
              </div>
              <div className="moviePoster centerPoster">
                <img
                  src={this.state.posterUrl}
                  alt={m.title}
                  onError={e => {
                    e.target.onError = null;
                    e.target.src = err;
                  }}
                />
              </div>
              <div className="movieRating">
                <div className="movieScore">
                  <i className="fa fa-star"></i>&nbsp;{m.vote_average}
                </div>
                &nbsp;
                <div className="movieVotes">
                  {m.vote_count}
                  <br />
                  ocen
                </div>
              </div>
              <div className="cast">
                <div className="member">
                  <b>Reżyseria:</b>
                  <br />
                  {this.state.director}
                </div>
                <div className="member">
                  <b>Scenariusz:</b>
                  <br />
                  {this.state.screenplay !== "Nieznany"
                    ? this.state.screenplay
                    : this.state.writer}
                </div>
              </div>
              <div className="movieOverview">
                {m.overview ? m.overview : "Brak opisu."}
              </div>
            </div>
          </div>
          <div className="buttons">
            <a
              href={`https://www.imdb.com/title/${this.state.movieInfo.imdb_id}/`}
              target="_blank"
            >
              <button className="imdbButton">Profil IMDB</button>
            </a>

            <Link to="/movie-app/">
              <button className="returnButton">Powrót</button>
            </Link>
          </div>
        </div>

        <footer>
          <img className="powered" src={powered} alt="powered"></img>
        </footer>
      </div>
    );
  }
}

export default Movie;
