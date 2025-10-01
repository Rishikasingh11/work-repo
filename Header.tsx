import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { NavLink, Link } from "react-router-dom";
// import { SgwtAccountCenter } from "@sgwt/sgwt-widgets-react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

export const Header: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="white"
      variant="light"
      style={{ margin: 0 }}
    >
      <Container fluid>
        {/* Brand Section */}
        <Navbar.Brand as={Link} to="/" className="navbar-title-link" style={{ margin: 0 }}>
          <img
            src="https://shared.sgmarkets.com/assets/images/socgen_logo_full.svg"
            height="32"
            alt="SG Markets"
            className="d-none d-md-block"
          />
          <div className="navbar-title-divider" style={{ padding: 0 }} />
          <div className="navbar-service-name" style={{ fontSize: "18px" }}>
            QUITUS
          </div>
        </Navbar.Brand>

        {/* Toggle Button for Mobile */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        {/* Nav Items */}
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="navbar-content">
            {/* Documentation + Form Links */}
            <Nav.Link as={NavLink} to="/documentation" className="navbar-link">
              <FormattedMessage id="menu.documentation" />
            </Nav.Link>
            <Nav.Link as={NavLink} to="/form" className="navbar-link">
              <FormattedMessage id="menu.form" />
            </Nav.Link>

            {/* Operations Dropdown */}
            <NavDropdown
              title="Opérations"
              className="navbar-link"
              id="basic-nav-dropdown-operations"
              style={{ fontSize: "15px" }}
            >
              <NavDropdown.Item as={Link} to="/operations/operationsIdentiques">
                Operations Identiques
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/operations/orphelins">
                Orphelins
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/operations/positionParDevise">
                Position Par Devise
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/operations/positionSynthetique">
                Vue synthétique des positions
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/operations/positionSynthetique/EUR">
                Vue synthétique des positions EUR
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/operations/orphelinMatch">
                Liste des orphelin matches
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/operations/manualMatching/F">
                Manual Matching FOFO
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/operations/manualMatching/B">
                Manual Matching BOBO
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/operations/manualMatchingAvecEcart">
                Manual Matching Avec Ecart
              </NavDropdown.Item>
            </NavDropdown>

            {/* Matching Dropdown */}
            <NavDropdown
              title="Matching"
              className="navbar-link"
              id="basic-nav-dropdown-matching"
              style={{ fontSize: "15px" }}
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            </NavDropdown>

            {/* Historique Dropdown */}
            <NavDropdown
              title="Historique"
              className="navbar-link"
              id="basic-nav-dropdown-historique"
              style={{ fontSize: "15px" }}
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>

        {/* SGWT Account Center */}
        {/* <SgwtAccountCenter
          availableLanguages={["en", "fr"]}
          authentication="sg-connect"
          mode="sg-markets"
        /> */}
      </Container>
    </Navbar>
  );
};

export default Header;
