import { init } from "metabase/app";
import { getRoutes } from "metabase/routes";
import reducers from "metabase/reducers-main";

init(reducers, getRoutes, store => {
});
