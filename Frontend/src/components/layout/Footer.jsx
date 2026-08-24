function Footer() {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>
        © {currentYear} Shanti Enterprises.
        All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;