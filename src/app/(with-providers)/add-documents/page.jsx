"use client";

import AppLayout from "@/app/AppLayout";
import AddDocumentsUI from "@/components/UI/AddDocuments/AddDocumentsUI";
import { Suspense } from "react";

const AddDocuments = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <AddDocumentsUI />
    </AppLayout>
    </Suspense>
  );
};

export default AddDocuments;
