import React, { Component } from "react";
import { t} from "ttag";

import SettingsBatchForm from "metabase/admin/settings/components/SettingsBatchForm";

export default class SettingsLingXiSSOForm extends Component {
  render() {
    return (
      <SettingsBatchForm
        {...this.props}
        breadcrumbs={[
          [t`Authentication`, "/admin/settings/authentication"],
          [t`LingXi Auth`],
        ]}
        enabledKey="lingxi-auth-enabled"
        layout={[
          {
            title: t`Server Settings`,
            settings: [
              "lingxi-auth-enabled",
              "lingxi-auth-app-id",
              "lingxi-auth-base-url",
            ],
          },
          {
            title: t`Group Schema`,
            settings: [
              "lingxi-auth-group-mappings",
            ],
          },
        ]}
      />
    );
  }
}
