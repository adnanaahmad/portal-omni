import React, { Component } from "react"
import { connect } from "react-redux"
import { navigate } from "gatsby"
import LOAN_TYPES from "data/LoanTypes"
import { injectIntl } from "react-intl"
import axios from "axios"
import APIUrl from "../../../APIUrl"
import {
     actionGetCOApplicantDetails,
  } from "../../state/actions"
import LoadingAnimation from "../../LoadingAnimation/LoadingAnimation"
import "../CoApplication/coapplicant.scss";
import PageHeading from "../../../components/PageHeading/PageHeading"
import ContentBox from "../../../components/Shared/ContentBox/ContentBox";

let urlParams;
let Token;
class CoApplication extends Component {

    componentDidMount() {
        localStorage.setItem("nextBtnHitBasicInfo", true);
        urlParams = this.props.hash.substring(1).split("/");
        Token = urlParams[urlParams.length - 1];
        this.props.dispatch(actionGetCOApplicantDetails(Token));       
    }

    render() {
        const {
            hash,
            applicationData: {
                coApplicantReturnFlowError,
                errorMessage
            }
        } = this.props;
        if (coApplicantReturnFlowError) {
            return (
                <ContentBox>
                    <div className="coapp-return-error">
                        <PageHeading
                            title={errorMessage}
                            subtitle={""}
                        />
                    </div>
                </ContentBox>
            )
        }
        return (<div className="initial-loader-coapplicant">
            <LoadingAnimation />
            </div>)
    }
}

export default connect(state => ({
    applicationData: state.applicationData,
    individualData: state.individualData,
    businessData: state.businessData,
    settings: state.settings,
}))(injectIntl(CoApplication))
