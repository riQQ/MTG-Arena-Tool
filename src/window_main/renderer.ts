/* eslint-disable @typescript-eslint/no-var-requires */
import { remote } from "electron";

if (!remote.app.isPackaged) {
  /*
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true
  });
  */
}

import "@github/time-elements";
import RenderApp from "./app/App";

RenderApp();
