import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="notFound">
      <br />
      <h2>Coś poszło nie tak :(</h2>
      <p>Wybrana strona nie została odnaleziona.</p>
      <br />
      <Link to="/netfilmoteka/">...Powrót do strony głównej...</Link>
    </div>
  );
};

export default NotFound;
