import React from "react";
import _ from "underscore";
import { Box, Flex } from "grid-styled";
import { connect } from "react-redux";
import { t, jt } from "ttag";
import { createSelector } from "reselect";

import Tooltip from "metabase/components/Tooltip";
import MetabotLogo from "metabase/components/MetabotLogo";

import { Grid, GridItem } from "metabase/components/Grid";
import Icon from "metabase/components/Icon";
import Link from "metabase/components/Link";
import Subhead from "metabase/components/type/Subhead";

import * as Urls from "metabase/lib/urls";
import { color } from "metabase/lib/colors";
import Greeting from "metabase/lib/greeting";

import Database from "metabase/entities/databases";

import { updateSetting } from "metabase/admin/settings/settings";

import { getUser } from "metabase/home/selectors";
import {
  getShowHomepageData,
  getShowHomepageXrays,
} from "metabase/selectors/settings";

const PAGE_PADDING = [1, 2, 4];

// use reselect select to avoid re-render if list doesn't change
const getParitionedCollections = createSelector(
  [(state, props) => props.list],
  list => {
    const [collections, items] = _.partition(
      list,
      item => item.model === "collection",
    );
    const [pinned, unpinned] = _.partition(
      items,
      item => item.collection_position != null,
    );

    // sort the pinned items by collection_position
    pinned.sort((a, b) => a.collection_position - b.collection_position);
    return {
      collections,
      pinned,
      unpinned,
    };
  },
);

//class Overworld extends Zelda
// @Search.loadList({
//   query: { collection: "root" },
//   wrapped: true,
// })
@connect(
  (state, props) => ({
    // split out collections, pinned, and unpinned since bulk actions only apply to unpinned
    ...getParitionedCollections(state, props),
    user: getUser(state, props),
    showHomepageData: getShowHomepageData(state),
    showHomepageXrays: getShowHomepageXrays(state),
  }),
  { updateSetting },
)
class Overworld extends React.Component {
  render() {
    const {
      showHomepageData,
    } = this.props;
    return (
      <Box>
        {showHomepageData && (
          <Database.ListLoader>
            {({ databases }) => {
              if (databases.length === 0) {
                return null;
              }
              return (
                <Box
                  pt={2}
                  px={PAGE_PADDING}
                  className="hover-parent hover--visibility"
                >
                  <SectionHeading>
                    <Flex align="center">
                      {t`Our data`}
                    </Flex>
                  </SectionHeading>
                  <Box mb={4}>
                    <Grid>
                      {databases.map(database => (
                        <GridItem w={[1, 1 / 3]} key={database.id}>
                          <Link
                            to={`browse/${database.id}`}
                            hover={{ color: color("brand") }}
                            data-metabase-event={`Homepage;Browse DB Clicked; DB Type ${database.engine}`}
                          >
                            <Box
                              p={3}
                              bg={color("bg-medium")}
                              className="hover-parent hover--visibility"
                            >
                              <Icon
                                name="database"
                                color={color("database")}
                                mb={3}
                                size={28}
                              />
                              <Flex align="center">
                                <h3 className="text-wrap">{database.name}</h3>
                                <Box ml="auto" mr={1} className="hover-child">
                                  <Flex align="center">
                                    <Tooltip
                                      tooltip={t`Learn about this database`}
                                    >
                                      <Link
                                        to={`reference/databases/${database.id}`}
                                      >
                                        <Icon
                                          name="reference"
                                          color={color("text-light")}
                                        />
                                      </Link>
                                    </Tooltip>
                                  </Flex>
                                </Box>
                              </Flex>
                            </Box>
                          </Link>
                        </GridItem>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              );
            }}
          </Database.ListLoader>
        )}
      </Box>
    );
  }
}

export const PIN_MESSAGE_STORAGE_KEY =
  "mb-admin-homepage-pin-propaganda-hidden";

export class AdminPinMessage extends React.Component {
  state = {
    showMessage: !window.localStorage.getItem(PIN_MESSAGE_STORAGE_KEY),
  };

  dismissPinMessage = () => {
    window.localStorage.setItem(PIN_MESSAGE_STORAGE_KEY, "true");
    this.setState({ showMessage: false });
  };
  render() {
    const { showMessage } = this.state;

    if (!showMessage) {
      return null;
    }

    const link = (
      <Link className="link" to={Urls.collection()}>{t`Our analytics`}</Link>
    );

    return (
      <Box>
        <SectionHeading>{t`Start here`}</SectionHeading>

        <Flex
          bg={color("bg-medium")}
          p={2}
          align="center"
          style={{ borderRadius: 6 }}
          className="hover-parent hover--visibility"
        >
          <Icon name="dashboard" color={color("brand")} size={32} mr={1} />
          <Box ml={1}>
            <h3>{t`Your team's most important dashboards go here`}</h3>
            <p className="m0 mt1 text-medium text-bold">{jt`Pin dashboards in ${link} to have them appear in this space for everyone`}</p>
          </Box>
          <Icon
            className="hover-child text-brand-hover cursor-pointer bg-medium"
            name="close"
            ml="auto"
            onClick={() => this.dismissPinMessage()}
          />
        </Flex>
      </Box>
    );
  }
}

const SectionHeading = ({ children }) => (
  <Box mb={1}>
    <h5
      className="text-uppercase"
      style={{ color: color("text-medium"), fontWeight: 900 }}
    >
      {children}
    </h5>
  </Box>
);

export default Overworld;
