import React, { Component } from "react"
import { connect } from "react-redux"
import { navigate } from "gatsby"
import LOAN_TYPES from "data/LoanTypes"
import { injectIntl } from "react-intl"
import axios from "axios"
import APIUrl from "../../../APIUrl"
import {
    actionGetCOApplicantDetails, actionGetPhoneVerificationId, actionMFAVerify, actionApplicationMFAStatusChange
} from "../../state/actions"
import LoadingAnimation from "../../LoadingAnimation/LoadingAnimation"
import "../PhoneVerification/PhoneVerification.scss";
import verifyTick from '../../../static/images/icons/verifyTick.svg'
import { PrimaryButton } from '../../../components/Shared/Button/Button'
import FortifidConstants from "../../../constants/fortifid";

let urlParams;
let Token;
class PhoneVerification extends Component {

    // coapplicationCheckToken = async (token) => {
    //     try {
    //         let response = await axios.get(`${APIUrl.API_BACKEND_URL}api/omni/coapplication-checkToken/${token}`);
    //         console.log("get details... ", response.data.userdetail[0]);
    //         if (response.status === 200) {
    //             localStorage.setItem("app_id", response.data.userdetail[0].app_id);
    //             navigate(`#ssnForm`);
    //         }
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }



    componentDidMount() {
        urlParams = this.props.hash.substring(1).split("/");
        Token = urlParams[urlParams.length - 1];
        console.log("TransactionId", Token);
        localStorage.setItem("TransactionId", Token)
        this.props.dispatch(actionGetPhoneVerificationId(Token));
        this.props.dispatch(actionApplicationMFAStatusChange(null));
    }




    render() {
        const {
            hash,
            applicationStatus: { mfaVerificationStatus }
        } = this.props;

        const onClickhandler = () => {
            this.props.dispatch(actionMFAVerify());
        }

        return (
            <div className="container initial-loader-coapplicant">
                <div className="row no-gutters justify-content-center">
                    <div className="col-16">
                        <div className="phone-verification-container text-center">
                            {mfaVerificationStatus !== FortifidConstants.EXPIRED &&
                                <img src={verifyTick} alt="successful verification" />
                            }
                            <div className="phone-verification-content">
                                <h4>
                                    {(mfaVerificationStatus === null || mfaVerificationStatus === FortifidConstants.WAITING) && 'Your phone number will be verified.'}
                                    {mfaVerificationStatus === FortifidConstants.VERIFIED &&
                                        'Your phone number is verified. Thank you !'}
                                    {mfaVerificationStatus === FortifidConstants.EXPIRED &&
                                        'Phone verification link is expired.'}
                                </h4>
                                <br />
                                {
                                    mfaVerificationStatus !== FortifidConstants.VERIFIED &&
                                    mfaVerificationStatus !== FortifidConstants.EXPIRED &&
                                    <React.Fragment>
                                        <PrimaryButton onClick={onClickhandler} size="medium" type="submit" disabled={mfaVerificationStatus === FortifidConstants.WAITING}>
                                            Click to Verify
                                        </PrimaryButton>
                                        <br />
                                        <p>Next, we need to confirm your identity.</p>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }
}

export default connect(state => ({
    applicationData: state.applicationData,
    individualData: state.individualData,
    businessData: state.businessData,
    settings: state.settings,
    applicationStatus: state.applicationStatus
}))(injectIntl(PhoneVerification))
