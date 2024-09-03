import React from 'react';

const Footer = () => {
  return (
<footer className="footer footer-center text-white p-10 mt-4 bg-red">
  <aside>
    <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
  </aside>
</footer>
  );
};

export default Footer;
