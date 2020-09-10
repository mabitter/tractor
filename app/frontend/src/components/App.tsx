import * as React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Switch, Route, Link } from "react-router-dom";
import { Overview } from "./Overview";
import { State } from "./State";
import { Video } from "./Video";
import { Debug } from "./Debug";
import { Map } from "./Map";
import styles from "./App.module.scss";

export const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/">
          farm-ng
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/overview">
              Overview
            </Nav.Link>
            <Nav.Link as={Link} to="/state">
              State
            </Nav.Link>
            <Nav.Link as={Link} to="/video">
              Video
            </Nav.Link>
            <Nav.Link as={Link} to="/map">
              Map
            </Nav.Link>
            <Nav.Link as={Link} to="/debug">
              Debug
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route exact path="/" component={Overview} />
        <Route exact path="/overview" component={Overview} />
        <Route exact path="/state" component={State} />
        <Route exact path="/video" component={Video} />
        <Route exact path="/map" component={Map} />
        <Route exact path="/debug" component={Debug} />
        <Route render={() => <p>Not found</p>} />
      </Switch>
    </div>
  );
};
