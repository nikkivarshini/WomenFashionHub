import React from 'react'
import Layout from '../components/Layout/Layout'
import policy from '../components/Layout/images/policy.avif'

const Policy = () => {
  return (
    <Layout title={"policy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src={policy}
            alt="contactus"
            style={{ width: "500px" }}
          />
        </div>
        <div className="col-md-4">
          <li>We collect personal information like name, email, address, and payment details.</li>
          <li>Information from communications with us may be retained for customer support purposes.</li>
          <li>Personal information is used for order processing and communication.</li>
          <li>With consent, we may send promotional emails and newsletters.</li>
          <li>Browsing information is used for website improvement and analytics.</li>
          <li>Appropriate measures are taken to secure personal information.</li>
          <li>Personal information is not sold or transferred to third parties without consent.</li>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;