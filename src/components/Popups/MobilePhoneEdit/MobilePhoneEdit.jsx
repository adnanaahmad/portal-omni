import React, { Component } from "react"
import { connect } from "react-redux"
import { PrimaryButton } from "components/Shared/Button/Button"
import Popup from "reactjs-popup"
import { FormattedMessage, injectIntl } from "react-intl"
import { Form } from "react-final-form"
import FormField, { FIELD_TYPES } from "components/Shared/Form/FormField/FormField"
import { Validators, composeValidators } from "components/Shared/Form/validators"
import {
    actionPhoneNoChangeReq
} from "components/state/actions"
import 'reactjs-popup/dist/index.css';
import "./MobilePhoneEdit.scss"

class MobilePhoneEdit extends Component {
    constructor(props) {
        super(props);
        this.state = { isModalOpen: false };
    }
    handleModal = () => {
        this.setState({ isModalOpen: true });
    }
    handleModalClose = () => {
        this.setState({ isModalOpen: false });
    }
    handleSubmitForm = async (values) => {
        const { dispatch } = this.props
        dispatch(actionPhoneNoChangeReq(values))
        this.handleModalClose()
    }

    render() {
        const { intl } = this.props
        let demoMobileNo

        return (
            <div className="demoPhoneChange">
                <PrimaryButton
                    size="small"
                    onClick={this.handleModal}
                >
                    Edit
                </PrimaryButton>
                <Popup
                    open={this.state.isModalOpen}
                    onClose={this.handleModalClose}
                    closeOnDocumentClick={true}
                >
                    <div className="modal">
                        <div className="fortifid-basic-info-form">
                            <Form
                                initialValues={{
                                    demoMobileNo
                                }}
                                onSubmit={this.handleSubmitForm}
                                render={({ handleSubmit, submitting, values, form }) => (
                                    <form onSubmit={handleSubmit}>
                                        <FormField
                                            name="demoMobileNo"
                                            required
                                            data={{
                                                required: true,
                                                name: "demoMobileNo",
                                                type: FIELD_TYPES.phone,
                                                country_code: "US",
                                                format: "(123) 456-7890",
                                                label: intl.formatMessage({
                                                    id: "forms.BasicInfoForm.fields.mobilePhone.label",
                                                }),
                                                hint: intl.formatMessage({
                                                    id: "forms.BasicInfoForm.fields.mobilePhone.hint",
                                                }),
                                            }}
                                            validate={composeValidators(
                                                ...[
                                                    Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                                                    Validators.phone(
                                                        intl.formatMessage({
                                                            id: "forms.BasicInfoForm.fields.mobilePhone.error",
                                                        }),
                                                        "US"
                                                    ),
                                                ]
                                            )}
                                        />
                                        <PrimaryButton className="cta-button" type="submit" size="medium">
                                            <FormattedMessage id="nextButton" defaultMessage="Submit" />
                                        </PrimaryButton>
                                    </form>
                                )}
                            />
                        </div>
                    </div>
                </Popup>
            </div>
        )
    }
}

export default connect()(injectIntl(MobilePhoneEdit))
