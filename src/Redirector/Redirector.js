import React from "react";

export default function Redirector(props) {
  props.history.push("/results/1");
  return <div></div>;
}
