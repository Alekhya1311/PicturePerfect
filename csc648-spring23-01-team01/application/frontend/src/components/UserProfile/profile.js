import React, { Component } from "react";
import Cookies from "js-cookie";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "./profile.css";

import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import Footer from "../Footer/Footer";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";

class UserProfile extends Component {
  state = {
    limit: 5,
    offset: 0,
    searchText: "",
    sortby: "",
    sortType: "DESC",
    posts: [],
    error: null,
    searchResults: [],
    isLoggedout: false,
  };

  handleInputChange = (event) => {
    this.setState({ searchText: event.target.value });
  };
  handleDelete(postId) {
    fetch("http://127.0.0.1:8000/delete_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postid: postId,
        username: Cookies.get("username"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "SUCCESS") {
          const updatedPosts = this.state.posts.filter(
            (post) => post.post_id !== postId
          );
          this.setState({ posts: updatedPosts });
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { limit, offset, searchText, sortby, sortType } = this.state;
    try {
      const response = await fetch("http://127.0.0.1:8000/view_public_posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ limit, offset, searchText, sortby, sortType }),
      });
      const data = await response.json();
      this.setState({ posts: data.posts, error: null });
    } catch (error) {
      this.setState({ error: "Failed to fetch search results" });
    }
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

  componentDidMount = async () => {
    try {
      const username = Cookies.get("username");
      const { limit, offset, searchText, sortby, sortType } = this.state;
      const response = await fetch("http://127.0.0.1:8000/list_user_posts", {
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
          username,
        }),
      });
      const { status: message, posts, noOfPosts } = await response.json();
      if (message === "SUCCESS") {
        if (noOfPosts === 0) {
          this.setState({
            error: "No posts found for the corresponding user",
            posts: [],
          });
        } else {
          this.setState({ posts, error: null });
        }
      } else {
        this.setState({ error: "Failed to fetch user posts" });
      }
    } catch (error) {
      this.setState({ error: "Failed to fetch user posts" });
    }
  };

  render() {
    const { searchText, posts, error, isLoggedout, searchResults } = this.state;
    const username = Cookies.get("username");
    console.log(username);
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
        <div className="search-container"></div>
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

        <div class="profile-edit-container">
          <div className="profile-edit-initial">{firstInitial}</div>
          <div className="profile-edit-username">{username}</div>
          <button
            className="edit-button"
            onClick={() => (window.location.href = "/edit-profile")}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>

        <div className="categories">
          <h2 className="category-head">All Posts</h2>
        </div>
        {error && <div>{error}</div>}
        <div className="row-cards">
          {posts.map((post, index) => (
            <Link
              key={post.post_id}
              to={`/post/${post.post_id}`}
              onClick={() => this.updateViews(post.post_id)}
            >
              <div key={post.post_id} className="publiccard">
                <img src={post.image} alt={post.desc} />

                <div className="profile_name">
                  <div className="name_profile">
                    <p style={{ fontWeight: "bold" }}>{post.made_by}</p>
                  </div>
                  <div className="dropdown">
                    <button
                      className="delete_dropdown"
                      onClick={(e) => {
                        e.stopPropagation();
                        const dropdown = e.currentTarget.nextElementSibling;
                        dropdown.style.display =
                          dropdown.style.display === "block" ? "none" : "block";
                      }}
                    >
                      ⋮
                    </button>
                    <div
                      className="delete_container"
                      style={{ display: "none" }}
                    >
                      <button onClick={() => this.handleDelete(post.post_id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="post_details">
                  <div>
                    <p>
                      {post.no_views}{" "}
                      <RemoveRedEyeIcon style={{ fontSize: "medium" }} /> Views
                    </p>
                  </div>
                  <p>
                    {post.no_likes}{" "}
                    <FavoriteIcon style={{ fontSize: "medium" }} /> Likes
                  </p>
                  <p>
                    {post.no_dislikes}{" "}
                    <HeartBrokenIcon style={{ fontSize: "medium" }} /> Dislikes
                  </p>
                </div>

                <span>{post.posted_on}</span>

                <div>
                  <p>{post.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

export default UserProfile;
