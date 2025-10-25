import React from "react";
import { useParams } from "react-router-dom";
const MenuView = () => {
  const { slug } = useParams();
  return <div>Viewing Menu for Table: {slug}</div>;
};
export default MenuView;
