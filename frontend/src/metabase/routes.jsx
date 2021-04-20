/* @flow weak */

import React from "react";

import { PLUGIN_LANDING_PAGE } from "metabase/plugins";

import { Route } from "metabase/hoc/Title";
import { Redirect, IndexRedirect, IndexRoute } from "react-router";
import { t } from "ttag";

import { loadCurrentUser } from "metabase/redux/user";

import App from "metabase/App.jsx";

import HomepageApp from "metabase/home/containers/HomepageApp";

/* Dashboards */
import DashboardApp from "metabase/dashboard/containers/DashboardApp";
import AutomaticDashboardApp from "metabase/dashboard/containers/AutomaticDashboardApp";

/* Browse data */
import BrowseApp from "metabase/browse/components/BrowseApp";
import DatabaseBrowser from "metabase/browse/containers/DatabaseBrowser";
import SchemaBrowser from "metabase/browse/containers/SchemaBrowser";
import TableBrowser from "metabase/browse/containers/TableBrowser";

import QueryBuilder from "metabase/query_builder/containers/QueryBuilder";

import CollectionEdit from "metabase/collections/containers/CollectionEdit";
import CollectionCreate from "metabase/collections/containers/CollectionCreate";
import ArchiveCollectionModal from "metabase/components/ArchiveCollectionModal";
import CollectionPermissionsModal from "metabase/admin/permissions/containers/CollectionPermissionsModal";

import PostSetupApp from "metabase/setup/containers/PostSetupApp";
// new question
import NewQueryOptions from "metabase/new_query/containers/NewQueryOptions";

import CreateDashboardModal from "metabase/components/CreateDashboardModal";

import { NotFound, Unauthorized } from "metabase/containers/ErrorPages";

import ArchiveDashboardModal from "metabase/dashboard/containers/ArchiveDashboardModal";
import DashboardHistoryModal from "metabase/dashboard/components/DashboardHistoryModal";
import DashboardMoveModal from "metabase/dashboard/components/DashboardMoveModal";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import DashboardDetailsModal from "metabase/dashboard/components/DashboardDetailsModal";
import { ModalRoute } from "metabase/hoc/ModalRoute";

import CollectionLanding from "metabase/components/CollectionLanding";
import Overworld from "metabase/containers/Overworld";

import ArchiveApp from "metabase/home/containers/ArchiveApp";
import SearchApp from "metabase/home/containers/SearchApp";

export const getRoutes = store => (
  <Route title={t`Metabase`} component={App}>
    {/* APP */}
    <Route
      onEnter={async (nextState, replace, done) => {
        done();
      }}
    >
      {/* MAIN */}
      <Route>
        {/* The global all hands rotues, things in here are for all the folks */}
        <Route
          path="/"
          component={Overworld}
          onEnter={(nextState, replace) => {
            const page = PLUGIN_LANDING_PAGE[0] && PLUGIN_LANDING_PAGE[0]();
            if (page && page !== "/") {
              replace(page);
            }
          }}
        />

        <Route path="/explore" component={PostSetupApp} />
        <Route path="/explore/:databaseId" component={PostSetupApp} />

        <Route path="search" title={t`Search`} component={SearchApp} />
        <Route path="archive" title={t`Archive`} component={ArchiveApp} />

        <Route path="collection/:collectionId" component={CollectionLanding}>
          <ModalRoute path="edit" modal={CollectionEdit} />
          <ModalRoute path="archive" modal={ArchiveCollectionModal} />
          <ModalRoute path="new_collection" modal={CollectionCreate} />
          <ModalRoute path="new_dashboard" modal={CreateDashboardModal} />
          <ModalRoute path="permissions" modal={CollectionPermissionsModal} />
        </Route>

        <Route path="activity" component={HomepageApp} />

        <Route
          path="dashboard/:dashboardId"
          title={t`Dashboard`}
          component={DashboardApp}
        >
          <ModalRoute path="history" modal={DashboardHistoryModal} />
          <ModalRoute path="move" modal={DashboardMoveModal} />
          <ModalRoute path="copy" modal={DashboardCopyModal} />
          <ModalRoute path="details" modal={DashboardDetailsModal} />
          <ModalRoute path="archive" modal={ArchiveDashboardModal} />
        </Route>

        <Route path="/question">
          <IndexRoute component={QueryBuilder} />
          {/* NEW QUESTION FLOW */}
          <Route
            path="new"
            title={t`New Question`}
            component={NewQueryOptions}
          />
          <Route path="notebook" component={QueryBuilder} />
          <Route path=":cardId" component={QueryBuilder} />
          <Route path=":cardId/notebook" component={QueryBuilder} />
        </Route>

        <Route path="/ready" component={PostSetupApp} />

        <Route path="browse" component={BrowseApp}>
          <IndexRoute component={DatabaseBrowser} />
          <Route path=":dbId" component={SchemaBrowser} />
          <Route path=":dbId/schema/:schemaName" component={TableBrowser} />
        </Route>

        {/* INDIVIDUAL DASHBOARDS */}

        <Route path="/auto/dashboard/*" component={AutomaticDashboardApp} />
      </Route>

    </Route>

    {/* INTERNAL */}
    <Route
      path="/_internal"
      getChildRoutes={(partialNextState, callback) =>
        // $FlowFixMe: flow doesn't know about require.ensure
        require.ensure([], function(require) {
          callback(null, [require("metabase/internal/routes").default]);
        })
      }
    />

    {/* DEPRECATED */}
    {/* NOTE: these custom routes are needed because <Redirect> doesn't preserve the hash */}
    <Route
      path="/q"
      onEnter={({ location }, replace) =>
        replace({ pathname: "/question", hash: location.hash })
      }
    />
    <Route
      path="/card/:cardId"
      onEnter={({ location, params }, replace) =>
        replace({
          pathname: `/question/${params.cardId}`,
          hash: location.hash,
        })
      }
    />
    <Redirect from="/dash/:dashboardId" to="/dashboard/:dashboardId" />
    <Redirect
      from="/collections/permissions"
      to="/admin/permissions/collections"
    />

    {/* MISC */}
    <Route path="/unauthorized" component={Unauthorized} />
    <Route path="/*" component={NotFound} />
  </Route>
);
