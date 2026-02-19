"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import styles from "./quillStyle.module.css";
import dynamic from "next/dynamic";

// Next
const StoryEditor = ({
  editorData,
  textEditorHandler,
  title,
  setEditorError,
  placeholder = "Write your story...",
  header = "Tell your story*",
}) => {
  const QuillEditor = useMemo(
    () =>
      dynamic(() => import("@/components/molecules/textEditor/QuillEditor"), {
        ssr: false,
      }),
    [],
  );

  return (
    <>
      <div className="editor-wrapper">
        <TypographyComp
          align="left"
          sx={{
            color: "rgba(167, 170, 174, 1)",
            fontWeight: 400,
            fontSize: "14px",
            mt: 0.5,
          }}
        >
          {header}
        </TypographyComp>
        <div id={styles.editorContainer}>
          <QuillEditor
            height="350px"
            placeholder={placeholder}
            editorData={editorData}
            textEditorHandler={textEditorHandler}
            title={title}
            setEditorError={setEditorError}
          />
        </div>
      </div>
    </>
  );
};

StoryEditor.propTypes = {
  editorData: PropTypes.any,
  textEditorHandler: PropTypes.any,
  title: PropTypes.any,
};

export default StoryEditor;
