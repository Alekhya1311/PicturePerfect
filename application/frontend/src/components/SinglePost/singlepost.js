import React, { Component } from "react";
import Cookies from "js-cookie";
import { Link, Navigate } from "react-router-dom";
import "./singlepost.css";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/base";
import {
  faThumbsUp,
  faThumbsDown,
  faTrash,
  faRetweet,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import Purchase from "../buyPhoto/purchase";

class SinglePostClass extends Component {
  state = {
    limit: 5,
    offset: 0,
    sortby: "",
    sortType: "DESC",
    post: null,
    comment: "",
    isLiked: false,
    isDisliked: false,
    numLikes: 0,
    numDislikes: 0,
    error: null,
    searchText: "",
    showComments: false,
    isLoggedout: false,
    isReposted: false,
    isPostCreated: false,
    isBuy: false,
    phone: "",
    email: "",
  };

  componentDidMount() {
    const { postId } = this.props;

    fetch("http://127.0.0.1:8000/get_post_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({
        postid: postId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "SUCCESS") {
          const {
            made_by,
            creation_date,
            no_likes,
            no_dislikes,
            points,
            isReshared,
            post_id,
            no_views,
            no_comments,
            image,
            desc,
            category,
            comments,
          } = data.post;
          this.setState({
            post: {
              madeBy: made_by,
              creationDate: creation_date,
              noLikes: no_likes,
              noDislikes: no_dislikes,
              points: points,
              isReshared: isReshared,
              postId: post_id,
              noViews: no_views,
              noComments: no_comments,
              image: image,
              desc: desc,
              category: category,
              comments: comments,
            },

            numLikes: data.post.no_likes,
            numDislikes: data.post.no_dislikes,
          });
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  handleInputChangeComment = (event) => {
    this.setState({ comment: event.target.value });
  };
  handleCommentsClick = () => {
    this.setState((prevState) => ({
      showComments: !prevState.showComments,
    }));
  };

  handleCommentSubmit = (event) => {
    event.preventDefault();
    const { postId } = this.props;
    const { comment, post } = this.state;
    const username = Cookies.get("username");

    fetch("http://127.0.0.1:8000/add_comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({
        postid: postId,
        comment: comment,
        username: username,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit comment");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "SUCCESS") {
          const newPost = { ...post };
          newPost.noComments = data.no_comments;
          newPost.comments = data.comments;
          this.setState({ post: newPost, comment: "" });
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  handleCommentDelete = async (index) => {
    const comments = [...this.state.post.comments];
    const commentToDelete = comments[index];
    const { postId } = this.props;
    const payload = {
      postid: postId,
      commentid: commentToDelete.comment_id,
      username: Cookies.get("username"),
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/delete_comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === "SUCCESS" && data.isCommentDeleted) {
          comments.splice(index, 1);
          const updatedPost = {
            ...this.state.post,
            comments: comments,
            noComments: comments.length,
          };
          this.setState({
            post: updatedPost,
          });
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

  handleLike = () => {
    const { postId } = this.props;

    fetch("http://127.0.0.1:8000/like_dislike_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({
        postid: postId,
        liked: true,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to like post");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "SUCCESS") {
          const { post } = this.state;
          const newPost = { ...post };
          newPost.is_liked = true;
          newPost.is_disliked = false;
          newPost.num_likes = data.isUpdated ? data.no_likes : post.num_likes;
          newPost.num_dislikes = data.isUpdated
            ? data.no_dislikes
            : post.num_dislikes;
          this.setState({
            post: newPost,
            isLiked: true,
            isDisliked: false,
            numLikes: newPost.num_likes,
            numDislikes: newPost.num_dislikes,
          });
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };
  handleDislike = () => {
    const { postId } = this.props;

    fetch("http://127.0.0.1:8000/like_dislike_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({
        postid: postId,
        liked: false,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to dislike post");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "SUCCESS") {
          const { post } = this.state;
          const newPost = { ...post };
          newPost.is_liked = false;
          newPost.is_disliked = true;
          newPost.num_likes = data.no_likes;
          newPost.num_dislikes = data.no_dislikes;
          this.setState({
            post: newPost,
            isLiked: false,
            isDisliked: true,
            numLikes: newPost.num_likes,
            numDislikes: newPost.num_dislikes,
          });
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  handleInputChange = (event) => {
    this.setState({ searchText: event.target.value });
  };

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
  handleShare = () => {
    const postUrl = window.location.href;
    const input = document.createElement("input");
    input.value = postUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    alert("Post URL copied to clipboard!");
  };
  handleRepost = () => {
    this.setState((prevState) => ({
      isReposted: !prevState.isReposted,
    }));
  };
  handleBuy = async (madeBy) => {
    const userDetailsResponse = await fetch(
      "http://127.0.0.1:8000/view_user_profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ username: madeBy }),
      }
    );
    const userDetailsData = await userDetailsResponse.json();
    console.log({ userDetailsData });

    this.setState((prevState) => ({
      isBuy: !prevState.isBuy,
      phone: userDetailsData.phonenum,
      email: userDetailsData.email,
    }));
  };

  handleCloseBuy = () => {
    this.setState({ isBuy: false });
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
  handleRepostButton = async () => {
    const { post } = this.state;
    console.log("inside handle repost");
    console.log(post);
    const imageData = new FormData();
    imageData.append("username", Cookies.get("username"));
    imageData.append("is_reshared", true);
    imageData.append("imageLink", post.image);
    imageData.append("description", post.description);
    imageData.append("category", post.category);

    console.log({ i: imageData });

    try {
      const response = await fetch("http://127.0.0.1:8000/create_post", {
        method: "POST",
        body: imageData,
      });

      const data = await response.json();

      // Handle the response based on the status
      if (data.status === "SUCCESS" && data.isPostCreated) {
        this.setState({ isPostCreated: true });
      } else {
        console.error(`Failed to create post: ${data.message}`);
      }
    } catch (error) {
      console.error(`Failed to create post: ${error}`);
    }
  };

  handleFormChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      post: {
        ...prevState.post,
        [name]: value,
      },
    }));
  };

  render() {
    const {
      post,
      isLiked,
      isDisliked,
      numLikes,
      numDislikes,
      error,
      showComments,
      isLoggedout,
      isReposted,
      isPostCreated,
      isBuy,
      phone,
      email,
    } = this.state;

    const username = Cookies.get("username");
    const firstInitial = username ? username.charAt(0) : "";
    if (isLoggedout) {
      return <Navigate to="/login" />;
    }
    if (isPostCreated) {
      return <Navigate to="/user-profile" />;
    }

    if (!post) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>{error}</div>;
    }
    return (
      <div>
        <div className="header">
          <header className="header">
            <h1>Picture Perfect</h1>
          </header>
          <div className="search-container">
            <div>
              <Link to="/uploadimage">
                <button className="new-post-button">
                  <FontAwesomeIcon icon={faPlus} className="icon" />
                  Post
                </button>
              </Link>
            </div>
          </div>
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
        </div>
        {isReposted ? (
          <div className="container-cropper">
            <div className="reposted-image">
              <img src={post.image} alt={post.desc} />
            </div>
            <div className="reposted-description">
              <textarea
                style={{
                  height: "10vh",
                  width: "45vw",
                  borderRadius: "10px",
                  verticalAlign: "text-top",
                  padding: "10px",
                  marginBottom: "10px",
                }}
                type="text"
                name="description"
                placeholder="Description"
                value={post.description}
                onChange={this.handleFormChange}
              ></textarea>
            </div>
            <div className="repost-button">
              <button onClick={this.handleRepostButton}>Repost</button>
            </div>
          </div>
        ) : (
          <div className="single-post-container ">
            <div className="single-post">
              <div className="post-header">
                <div className="post-user">
                  <span data-testid="post-author">{post.madeBy}</span>
                </div>
                <div className="post-image">
                  <img
                    src={post.image}
                    alt={post.desc}
                    data-testid="post-image"
                    style={{ display: "block", margin: "0 auto" }}
                  />
                </div>

                <div className="post-info">
                  <div className="post-stats">
                    <span className="post-views">{post.noViews} views</span>
                    <span className="post-likes">
                      <button
                        className="like-button"
                        onClick={this.handleLike}
                        data-testid="like-but"
                      >
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          className={`${isLiked ? "active" : ""}`}
                        />
                      </button>
                      <span>{numLikes}</span>
                    </span>
                    <span className="post-dislikes">
                      <button
                        className="dislike-button"
                        onClick={this.handleDislike}
                        data-testid="button-dislike"
                      >
                        <FontAwesomeIcon
                          icon={faThumbsDown}
                          className={`${isDisliked ? "active" : ""}`}
                        />
                      </button>
                      <span>{numDislikes}</span>
                    </span>
                    {post.noComments > 0 && (
                      <span
                        className="post-comments"
                        onClick={this.handleCommentsClick}
                      >
                        {post.noComments} comments
                      </span>
                    )}
                    <span className="post-repost">
                      <button
                        className="repost-button"
                        onClick={this.handleRepost}
                      >
                        <FontAwesomeIcon icon={faRetweet} />
                      </button>
                    </span>
                    <span className="post-share">
                      <button
                        className="share-button"
                        onClick={this.handleShare}
                      >
                        <FontAwesomeIcon icon={faShare} />
                      </button>
                    </span>
                    <Button
                      onClick={() => this.handleBuy(post.madeBy)}
                      className="buy-button"
                    >
                      Buy
                    </Button>

                    <Dialog open={isBuy} onClose={this.handleCloseBuy}>
                      <DialogTitle>Purchase</DialogTitle>
                      <DialogContent>
                        <Purchase
                          postedBy={post.madeBy}
                          phoneNumber={phone}
                          email={email}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleCloseBuy}>Close</Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </div>
              </div>

              <div className="post-body">
                <p>{post.desc}</p>
              </div>
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <div className="post-footer">
                  <div className="post-comment">
                    <div className="comment-container">
                      <input
                        type="text"
                        placeholder="Add Comment"
                        value={this.state.comment}
                        onChange={this.handleInputChangeComment}
                      />
                      <button
                        className="comment-button"
                        onClick={this.handleCommentSubmit}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                  {showComments && post.noComments > 0 && (
                    <div className="post-comments-section">
                      <div>
                        {post.comments.map((comment, index) => (
                          <Box className="each-comment" key={index}>
                            <span className="comment-username">
                              {comment.username}:{" "}
                            </span>
                            <span className="comment-text">
                              {comment.comment}
                            </span>
                            <button
                              onClick={() => this.handleCommentDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </Box>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const SinglePost = (props) => {
  const postId = useParams().postId;

  return <SinglePostClass postId={postId} {...props} />;
};

export default SinglePost;
