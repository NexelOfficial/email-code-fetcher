/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import App from "./pages/App";
import Notifiy from "./pages/Notifiy";
import "./index.css";

render(
  () => (
    <Router>
      <Route path="*" component={App} />
      <Route path="/notification/:code" component={Notifiy} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
