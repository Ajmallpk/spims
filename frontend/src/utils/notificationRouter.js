export function getNotificationRoute(notification) {


    console.log("FULL NOTIFICATION:", notification);

    const target = notification.extra_data?.target;
    console.log("TARGET:", target);

    if (!target) {
        return null;
    }


    console.log("PAGE:", target.page);

    switch (target.page) {

        // ---------------- Citizen ----------------

        case "CITIZEN_COMPLAINT_DETAIL":
            return `/citizen/complaints/${target.id}`;

        case "CITIZEN_COMPLAINT_CHAT":
            return `/citizen/messages/${target.id}`;


        // ---------------- Ward ----------------

        case "WARD_COMPLAINT_DETAIL":
            return `/ward/complaints/${target.id}`;



        case "WARD_REASSIGNED_COMPLAINT":
            return `/ward/reassigned-complaints/${target.id}`;

        case "WARD_COMPLAINT_CHAT":
            return `/ward/complaint-chats/${target.id}`;

        case "WARD_AUTHORITY_CHAT":
            return "/ward/chat";

        case "WARD_CITIZEN_VERIFICATIONS":
            return `/ward/citizen-verifications?verification=${target.verification_id}`;


        case "CITIZEN_VERIFICATION":
            return "/citizen/verification";


        case "PANCHAYATH_VERIFICATION":
            return "/panchayath/profile";


        // ---------------- Panchayath ----------------

        case "PANCHAYATH_COMPLAINT_DETAIL":
            return `/panchayath/complaints/${target.id}`;

        case "PANCHAYATH_AUTHORITY_CHAT":
            return "/panchayath/chat";

        case "PANCHAYATH_WARD_VERIFICATIONS":
            return `/panchayath/ward-verifications?verification=${target.verification_id}`;


        // ---------------- Admin ----------------

        // ---------------- Admin ----------------

        case "ADMIN_COMPLAINT_DETAIL":
            return `/admin/complaints/${target.id}`;

        case "ADMIN_PANCHAYATH_VERIFICATIONS":
            return `/admin/panchayath-verifications?verification=${target.verification_id}`;

        case "ADMIN_DASHBOARD":
            return "/admin/dashboard";


        // ---------------- Default ----------------


        case "CITIZEN_DASHBOARD":
            return "/citizen/home";

        case "WARD_DASHBOARD":
            return "/ward/dashboard";

        case "PANCHAYATH_DASHBOARD":
            return "/panchayath/dashboard";

        case "ADMIN_DASHBOARD":
            return "/admin/dashboard";

        case "DASHBOARD":
        default:
            return null;
    }

}