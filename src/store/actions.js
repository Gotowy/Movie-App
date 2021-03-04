import axios from "axios";

export const setGenre = (genre) => {
  return { type: "SET_GENRE", genre };
};

export const setSorting = (sorting) => {
  return { type: "SET_SORTING", sorting };
};

export const setPage = (page) => {
  return { type: "SET_PAGE", page };
};

export const callReset = () => {
  return { type: "CALL_RESET" };
};

export const resetApp = () => {
  return { type: "RESET_APP" };
};

export const getGenreList = (request) => {
  return (dispatch) => {
    axios
      .get(request)
      .then((res) => {
        const genres = res.data.genres;
        dispatch({ type: "GET_GENRE_LIST", genres });
      })
      .catch((err) => console.log(err.message));
  };
};

export const getMovieList = (request) => {
  return (dispatch, getState) => {
    let movies = [];
    let pages = null;
    axios
      .get(request)
      .then((res) => {
        const maxPages = getState().maxPages;
        const totalPages = res.data.total_pages;
        pages = totalPages >= maxPages ? maxPages : totalPages;
        movies = res.data.results;
        dispatch({ type: "GET_MOVIE_LIST", movies, pages });
      })
      .catch((err) => console.log(err.message));
  };
};
