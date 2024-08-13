import React, {
  Component,
  useState,
  useRef,
  createContext,
  useContext,
} from "react";
import { Link } from "react-router-dom";
import { Box, Button, Container, Grid, Tab, Tabs } from "@mui/material";
import "./post.css";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import { generateDownload } from "../utils/cropImage";
import Filters from "../Filters/Filters";
import FilterEffect from "../FilterEffects/FilterEffect";
import Edit from "../EditPhoto/Edit";
import ImageField from "../ImageField/ImageField";
import ImageComponent from "../ImageComponent/ImageComponent";
import Header from "../Header/header";

export const FilterContext = createContext();
export default function Post() {
  const [tabFilter, setTabFilter] = React.useState("filter");
  const [filterClass, setFilterClass] = useState("");
  const [customFilter, setCustomFilter] = useState({
    contrast: 100,
    brightness: 100,
    saturate: 100,
    sepia: 0,
    gray: 0,
  });

  const value = {
    tabFilter,
    setTabFilter,
    filterClass,
    setFilterClass,
    customFilter,
    setCustomFilter,
  };

  return (
    <div>
      <Header />
      <FilterContext.Provider value={value}>
        <div className="icon-container">
          <img
            src={require("../../Images/picturePerfect.jpg")}
            className="icon-logo"
          ></img>
        </div>
        <div>
          <div className="grid-container">
            <div className="image-field">
              <ImageField />
            </div>
            <div className="filter-field">
              <Filters />
              {tabFilter === "filter" ? <FilterEffect /> : <Edit />}
            </div>
          </div>
        </div>
      </FilterContext.Provider>
    </div>
  );
}
