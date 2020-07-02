import { t } from "ttag";
import { updateIn } from "icepick";

import {
  PLUGIN_AUTH_PROVIDERS,
  PLUGIN_ADMIN_SETTINGS_UPDATES,
} from "metabase/plugins";

import MetabaseSettings from "metabase/lib/settings";

import LingXiButton from "metabase/auth/components/LingXiButton";

import AuthenticationOption from "metabase/admin/settings/components/widgets/AuthenticationOption";
import SettingsLingXiSSOForm from "metabase/admin/settings/components/SettingsLingXiSSOForm";

const LINGXI_PROVIDER = {
  name: "lingxi",
  Button: LingXiButton,
};

PLUGIN_AUTH_PROVIDERS.push(providers =>
  MetabaseSettings.lingxiAuthEnabled()
    ? [LINGXI_PROVIDER, ...providers]
    : providers,
);

PLUGIN_ADMIN_SETTINGS_UPDATES.push(sections =>
  updateIn(sections, ["authentication", "settings"], settings => [
    ...settings,
    {
      authName: t`Sign in with LingXi SSO`,
      authDescription: t`Allows LingXi users login Metabase.`,
      authType: "lingxi",
      authEnabled: settings => settings["lingxi-auth-configured?"],
      widget: AuthenticationOption,
    },
  ]),
);

PLUGIN_ADMIN_SETTINGS_UPDATES.push(sections => ({
  ...sections,
  "authentication/lingxi": {
    component: SettingsLingXiSSOForm,
    sidebar: false,
    settings: [
      {
        key: "lingxi-auth-enabled",
        display_name: t`LingXi Authentication`,
        description: null,
        type: "boolean",
      },
      {
        key: "lingxi-auth-app-id",
        display_name: t`App ID`,
        placeholder: "",
        type: "string",
        required: true,
        autoFocus: true,
      },
      {
        key: "lingxi-auth-base-url",
        display_name: t`Base URL`,
        placeholder: "",
        type: "string",
      },
    ],
  },
}));
