import React from "react";

import { Link } from "react-router-dom";

const About = () => {
    
  return (
    <div className="about">
      <h1>About Us</h1>
      <p>Hello Everyone! We are <strong> CSC648/848-Spring23-01-Team 01 </strong> from Software Engineering Class SFSU - Spring 2023
      <strong>  <h3> Section 01 - Team 01 </h3></strong></p>
      <p id='info'>Members in our team are:</p>
      <ul >
      <li><Link to={"/alekya"} className="nav-link">
                      Alekya Bairaboina (Team Lead and Front-End Developer)
                    </Link></li>
                    <li><Link to={"/vinay"} className="nav-link">
                    Vinay (Front-End Lead)
                    </Link></li>
                    <li><Link to={"/nick"} className="nav-link">
                    Nick (Product Owner)
                    </Link></li>
                    <li><Link to={"/jacob"} className="nav-link">
                    Jacob (Github and Scrum Master)
                    </Link></li>
                    <li><Link to={"/ishika"} className="nav-link">
                    Ishika (Back-End Lead)
                    </Link></li>

    
       
      </ul>
      <p>Click on the above links to know more about our team members</p>

      <p>
        We scheduled our meetings on <strong>Monday</strong> and <strong>Wednesday</strong> of every week.
      </p>
      <p id = 'skills'>
        Our communication channel is <strong>Slack</strong> 
        {/* <img src= {Icon} id = 'icon'/> */}
      </p>

     
      
    </div>
    
   
  );
}
export default About;