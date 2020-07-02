import React, { Component } from "react";

import AuthProviderButton from "metabase/auth/components/AuthProviderButton";

export default class LingXiButton extends Component {
  constructor(props) {
    super(props);
    this.lingxiAuth = this.lingxiAuth.bind(this);
  }

  lingxiAuth() {
    window.location.href = "/api/session/lingxi_auth";
  }

  render() {
    return (
      <div onClick={this.lingxiAuth}>
        <AuthProviderButton provider="lingxi" />
      </div>
    );
  }
}
