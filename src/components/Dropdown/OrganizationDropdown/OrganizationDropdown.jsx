import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { actionApplicationDataUpdate, actionGetOrganizationList } from "../../state/actions";

class OrganizationDropDown extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(actionGetOrganizationList());
    const organizationId = localStorage.getItem("organizationId");
    organizationId
      ? this.props.dispatch(actionApplicationDataUpdate({ organizationId }))
      : this.props.dispatch(
          actionApplicationDataUpdate({ organizationId: "" })
        );
  }

  componentWillUnmount() {}

  render() {
    let { organizationList } = this.props.applicationData;
    organizationList = organizationList || [];

    const handleDropDown = (event) => {
        this.props.dispatch(actionApplicationDataUpdate({organizationId: event.target.value}));
        localStorage.setItem("organizationId", event.target.value);
    }

    return (
        <div className="d-flex justify-content-center">
            <select
            name="demodata"
            id="demodata"
            value={this.props.applicationData.organizationId}
            onChange={handleDropDown}
            style={{
                width: "100%",
                maxWidth: '300px',
                margin: "20px 0px",
                padding: "15px 5px",
                borderRadius: 5,
                border: "solid 1px #c2d2d9",
            }}
            >
            <option value="">Select Organization</option>
            {organizationList.map((curr, index) => {
                return (
                <option key={index} value={curr.organization_id}>
                    {curr.organization_name}
                </option>
                );
            })}
            </select>
        </div>
    );
  }
}

export default connect(state => ({
    applicationData: state.applicationData,
    individualData: state.individualData,
    settings: state.settings,
  }))(injectIntl(OrganizationDropDown))