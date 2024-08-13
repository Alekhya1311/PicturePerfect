import './index.css'

const Alekya = () => (
  <div class="member">
    <img src={require('../../Images/Alekya.jpeg')} />
    <h2>Alekya Bairaboina (Team Lead and Front-End Developer)</h2>
    <p>Hey!! I am <strong>Alekya Bairaboina.</strong> I'm a graduate CS student and this is my first semester. I love solving real world challenging problems and love developing web applications. 
    I am happy to be a part of CSC 848 class and looking forward to learn and expand my skill set.</p>

    <div class="member-info">
      <ul>
        <li><strong>Skills:</strong> <span>React | JavaScript | MySQL </span></li>
        <li><strong>Degree Pursuing in SFSU:</strong> <span>Masters in CS</span></li>
        <li><strong>Contact:</strong> <span>abairaboina@sfsu.com</span></li>
      </ul>
    </div>

    <p>
      I completed my Undergrad in Electrical and Electronics Engineering and have started working at the Schrocken Inc. as a Software Developer. I have Enhanced user experience and optimized performance of the Mosymphony application, a platform that enables seamless and streamlined supply chains across the Pharma ecosystem between business owners and manufacturers. 
    </p>

    <ul class="experience">
      <li>
        Compiled and analyzed end-to-end processes and codes to troubleshoot production issues and identified areas to improve performance, robustness, and resilience of the application.
      </li>
      <li>
        Designed and developed a complicated SFTP integration layer in our application for a business owner – created a separate SFTP server and built pull and push routines that are executed every hour using Node-cron to parse .csv format files and convert data to JSON and vice versa. Implemented REST APIs to display relevant information for business and manufactures.
      </li>
    </ul>
  </div>
)

export default Alekya

