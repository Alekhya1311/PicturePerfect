import React from "react";
import { useLocation } from "react-router-dom";
import "./purchase.css";
import Header from "../Header/header";

const Purchase = (props) => {
  const location = useLocation();
  console.log(props);
  const { postedBy, phoneNumber, email } = props;

  const [quantity, setQuantity] = React.useState(1);
  const [totalPrice, setTotalPrice] = React.useState(10);

  return (
    <div>
      <Header />
      <div className="buy-photo">
        <h2>Buy Photo</h2>
        <div className="price-details">
          <p>Price: $10</p>
        </div>
        <div className="posted-by-details">
          <p>Posted By: {postedBy}</p>
          <p>Phone: {phoneNumber}</p>
          <p>Email: {email}</p>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
