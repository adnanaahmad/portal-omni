import { combineReducers } from "redux"

import settings from "./reducers/settings"
import applicationData from "./reducers/applicationData"
import individualData from "./reducers/individualData"
import businessData from "./reducers/businessData"
import localeData from "./reducers/locale"
import applicationStatus from "./reducers/applicationStatus"
import existingCustomerData from "./reducers/existingCustomerData"

export default combineReducers({ settings, applicationData, individualData, businessData, localeData, applicationStatus, existingCustomerData })
