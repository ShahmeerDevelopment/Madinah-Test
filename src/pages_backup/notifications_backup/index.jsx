import Private from "@/Layouts/Private";

const { default: NotificationsUI } = require("@/components/UI/Notifications/NotificationsUI");

const Notifications = () => {
    return <NotificationsUI />;
};

Notifications.Layout = Private;

export default Notifications;