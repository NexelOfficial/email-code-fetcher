/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import { App } from "./pages/App";
import { Onboarding } from "./pages/Onboarding";
import Notifiy from "./pages/Notifiy";
import "./index.css";

document.addEventListener("contextmenu", (event) => event.preventDefault());

render(
  () => (
    <Router>
      <Route path="*" component={App} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/notification" component={Notifiy} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
