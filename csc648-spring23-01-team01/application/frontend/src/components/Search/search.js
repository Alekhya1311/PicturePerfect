import React, { Component } from "react";
import Cookies from "js-cookie";
import { Link, Navigate } from "react-router-dom";
import "./search.css";
import Footer from "../Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { catImages } from "../utils/CategoryImg";

class Search extends Component {
  state = {
    limit: 5,
    offset: 0,
    searchText: "",
    category: "",
    sortby: "",
    sortType: "DESC",
    categories: [],
    searchResults: [],
    error: null,
    isLoggedout: false,
  };

  handleInputChange = (event) => {
    this.setState({ searchText: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { limit, offset, searchText, sortby, sortType, category } =
      this.state;
    try {
      const response = await fetch("http://127.0.0.1:8000/view_public_posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          limit,
          offset,
          searchText,
          sortby,
          sortType,
          category,
        }),
      });
      const data = await response.json();
      if (data.status === "SUCCESS") {
        if (data.posts.length > 0) {
          this.setState({ searchResults: data.posts, error: null });
        } else {
          this.setState({ searchResults: [], error: data.message });
        }
      } else {
        this.setState({ searchResults: [], error: data.message });
      }
    } catch (error) {
      this.setState({ error: "Failed to fetch search results" });
    }
  };

  handleCategoryClick = (category) => {
    this.setState({ category: category }, () => {
      const fakeEvent = { preventDefault: () => {} };
      this.handleSubmit(fakeEvent);
    });
  };
  handleLogout = async () => {
    const username = Cookies.get("username");
    const payload = {
      username: username,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        console.log({ data });
        console.log(data.status);
        console.log(data.isLoggedout);
        console.log(data.status === "SUCCESS" && data.isLoggedout);
        if (data.status === "SUCCESS" && data.isLoggedout) {
          Cookies.remove("token");
          Cookies.remove("username");
          this.setState({ isLoggedout: data.isLoggedout });
        } else {
          console.log(data.message);
        }
      } else {
        console.log("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount = async () => {
    console.log("inside component did");
    try {
      const response = await fetch("http://127.0.0.1:8000/fetch_categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await response.json();
      this.setState({ categories: data.categories, error: null });
    } catch (error) {
      console.log(error);
      this.setState({ error: "Failed to fetch categories" });
    }
  };
  updateViews = async (postId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/add_view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ postid: postId }),
      });
      const data = await response.json();
      if (data.status === "SUCCESS") {
        const { searchResults } = this.state;
        const updatedSearchResults = searchResults.map((result) => {
          if (result.post_id === data.postid) {
            return { ...result, no_views: data.noOfViews };
          }
          return result;
        });
        this.setState({ searchResults: updatedSearchResults });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    const {
      searchText,
      categories,
      searchResults,
      error,
      isLoading,
      isLoggedout,
    } = this.state;
    const username = Cookies.get("username");
    const firstInitial = username ? username.charAt(0) : "";
    if (isLoggedout) {
      return <Navigate to="/login" />;
    }
    return (
      <div>
        <header className="header">
          <h1>Picture Perfect</h1>

          <div>
            <Link to="/uploadimage">
              <button className="new-post-button">
                <FontAwesomeIcon icon={faPlus} className="icon" />
                Post
              </button>
            </Link>
          </div>

          <form className="search-form" onSubmit={this.handleSubmit}>
            <div className="header-right">
              <input
                className="search-bar"
                type="text"
                value={searchText}
                onChange={this.handleInputChange}
                placeholder="Images, #tags, @users"
              />
              <button
                className="search-button"
                onClick={this.handleSubmit}
                data-testid="search-button"
              >
                <FontAwesomeIcon icon={faSearch} className="icon" />
              </button>
            </div>
          </form>

          {/* </div> */}

          <nav>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
            </ul>
          </nav>
        </header>

        <div className="profile-container">
          <div className="profile-initial">{firstInitial}</div>
          <div className="profile-username">{username}</div>

          <div className="profile-dropdown">
            <button className="profile-dropdown-button">⋮</button>
            <div className="profile-dropdown-content">
              <Link to="/user-profile">View Profile</Link>
              <button onClick={this.handleLogout}>Logout</button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {searchResults.length > 0 && (
              <div className="row-cards">
                {searchResults.map(
                  (result, index) =>
                    !result.isHeading && (
                      <Link
                        key={result.post_id}
                        to={`/post/${result.post_id}`}
                        onClick={() => this.updateViews(result.post_id)}
                      >
                        <div className="publiccard">
                          <img src={result.image} alt={result.desc} />
                          <h2>{result.desc}</h2>
                          <p>Made by: {result.made_by}</p>
                          <p>No. of views: {result.no_views}</p>
                          <p>No. of likes: {result.no_likes}</p>
                          <p>No. of dislikes: {result.no_dislikes}</p>
                          <p>Posted on: {result.creation_date}</p>
                          <p>Category: {result.category}</p>
                        </div>
                      </Link>
                    )
                )}
              </div>
            )}
            {searchResults.length === 0 && categories.length > 0 && (
              <>
                <div className="categories">
                  <h2 className="category-head">Categories</h2>
                </div>
                <div className="row">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="search-card"
                      onClick={() => this.handleCategoryClick(category)}
                    >
                      <img src={catImages.src} />
                      <h2 className="category">{category}</h2>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
        {error && <div>{error}</div>}
      </div>
    );
  }
}

export default Search;
