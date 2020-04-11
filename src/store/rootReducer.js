const initState = {
  apiKey: process.env.REACT_APP_API_KEY,
  language: "&language=pl",
  genres: [],
  movies: [],
  genre: { id: "", name: "Gatunek" }, //current genre filter
  sorting: "popularity", //current sorting option
  page: 1, //current result page
  pages: null, //how many pages given result includes
  maxPages: 10, //SET MAXIMUM AMOUNT of pages for movies result (one page contains up to 20 movies)
  resetNeeded: false,
};

const rootReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_GENRE_LIST":
      return { ...state, genres: action.genres };
    case "GET_MOVIE_LIST":
      return { ...state, movies: action.movies, pages: action.pages };
    case "SET_GENRE":
      return { ...state, genre: action.genre };
    case "SET_SORTING":
      return { ...state, sorting: action.sorting };
    case "SET_PAGE":
      return { ...state, page: action.page };
    case "CALL_RESET":
      return { ...state, resetNeeded: true };
    case "RESET_APP":
      document.querySelector(".genres").classList.add("grey");
      document.querySelector(".genres").value = "Gatunek";
      document.querySelector(".sorting").value = "popularity";
      return {
        ...initState,
        genres: state.genres,
      };
    default:
      return state;
  }
};

export default rootReducer;
