
const USER_ENDPOINTS = {
    ALL: {
        HOMEPAGE: "/homepage", // see by any user even guess
    },
    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        PROFILE: "/admin/profile",
        ACCOUNTS: "/admin/accounts", // accounts are managed by admin
        NOTIFICATION: "/admin/notification",
        REPORTS: "/admin/reports", // reports watch by admin
    },
    MANAGER: {
        DASHBOARD: "/manager/dashboard",
        PROFILE: "/manager/profile",
        MEDICAL_EVENT: "/manager/medical-event",
        VACCINATION_CAMPAIGN: "/manager/vaccination-campaign",
        HEALTH_CHECK_CAMPAIGN: "/manager/health-check-campaign",
        NOTIFICATION: "/manager/notification",
        REPORTS: "/manager/reports", // reports watch by manager
    },
    SCHOOLNURSE: {
        DASHBOARD: "/schoolNurse/dashboard",
        PROFILE: "/schoolNurse/profile",
        MEDICAL_EVENT: "/schoolNurse/medical-event",
        VACCINATION_CAMPAIGN: "/schoolNurse/vaccination-campaign",
        HEALTH_CHECK_CAMPAIGN: "/schoolNurse/health-check-campaign",
        PRESCRIPTION: "/schoolNurse/prescription",
        NOTIFICATION: "/schoolNurse/notification",
    },
    PARENT: {
        DASHBOARD: "/parent/dashboard",
        PROFILE: "/parent/profile",
        HEALTH_DECLARATION: "/parent/health-declaration",
        MEDICAL_EVENT: "/parent/medical-event",
        PRESCRIPTION: "/parent/prescription",
        NOTIFICATION: "/parent/notification",
        HEALTH_CHECK_CAMPAIGN: "/parent/vaccination-campaign",
        HEALTH_CHECK_CAMPAIGN: "/parent/health-check-campaign",
    },
};

const ALL_ENDPOINTS = USER_ENDPOINTS.ALL;
const ADMIN_ENDPOINTS = USER_ENDPOINTS.ADMIN;
const MANAGER_ENDPOINTS = USER_ENDPOINTS.MANAGER;
const SCHOOLNURSE_ENDPOINTS = USER_ENDPOINTS.SCHOOLNURSE;
const PARENT_ENDPOINTS = USER_ENDPOINTS.PARENT;

const RESOURCE_ENDPOINTS = {
    USERS: "/users",
    BLOGS: "/blogs",
}

export { 
    USER_ENDPOINTS,
    ALL_ENDPOINTS , 
    ADMIN_ENDPOINTS ,
    MANAGER_ENDPOINTS ,
    SCHOOLNURSE_ENDPOINTS ,
    PARENT_ENDPOINTS ,
    RESOURCE_ENDPOINTS 
};