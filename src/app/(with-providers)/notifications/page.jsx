"use client";

import Private from "@/Layouts/Private";
import { Suspense } from "react";

const {
  default: NotificationsUI,
} = require("@/components/UI/Notifications/NotificationsUI");

const Notifications = () => {
  return (
    <Suspense>
    <Private withFooter={true} withSidebar={true}>
      <NotificationsUI />
    </Private>
    </Suspense>
  );
};

export default Notifications;
