"use client";
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import {
  AiFillFilePdf,
  AiFillFileWord,
  AiFillFilePpt,
  AiFillFileUnknown,
} from "react-icons/ai";

const StyledAccordion = styled(Accordion)`
  background: #000 !important;
  border: 1px solid rgba(0, 255, 0, 0.25);
  border-radius: 12px !important;
  margin: 12px 0;
  box-shadow: none !important;
  transition: all 0.3s ease;

  &:hover {
    border: 1px solid rgba(0, 255, 0, 0.5);
  }

  &::before {
    display: none;
  }
`;

const StyledSummary = styled(AccordionSummary)`
  padding: 0 18px;
  min-height: 50px !important;

  .MuiAccordionSummary-content {
    margin: 10px 0 !important;
    font-size: 15px;
    font-weight: 500;
    color: #ddd;
  }
`;

const StyledDetails = styled(AccordionDetails)`
  background: #050505;
  padding: 14px 20px;
  color: #aaa;
  font-size: 14px;

  ul {
    list-style-type: disc;
    padding-left: 24px; /* proper indent like Google Drive */
    margin: 0;
  }

  li {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  a {
    color: #ddd;
    text-decoration: none;
    font-size: 14px;

    &:hover {
      color: #00ff99;
      text-decoration: underline;
    }
  }
`;

type Props = {
  title: string;
  files: { name: string; url: string }[];
};

const getFileIcon = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return <AiFillFilePdf color="#ff4d4f" size={18} />;
    case "doc":
    case "docx":
      return <AiFillFileWord color="#2b6eff" size={18} />;
    case "ppt":
    case "pptx":
      return <AiFillFilePpt color="#ff8c00" size={18} />;
    default:
      return <AiFillFileUnknown color="#aaa" size={18} />;
  }
};

const ResourceAccordion: React.FC<Props> = ({ title, files }) => {
  return (
    <StyledAccordion>
      <StyledSummary expandIcon={<FiChevronRight color="#00ff99" size={18} />}>
        <Typography>{title}</Typography>
      </StyledSummary>
      <StyledDetails>
        {files.length > 0 ? (
          <ul>
            {files.map((file, i) => (
              <li key={i}>
                {getFileIcon(file.name)}
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <Typography style={{ color: "#555" }}>
            No files available.
          </Typography>
        )}
      </StyledDetails>
    </StyledAccordion>
  );
};

export default ResourceAccordion;
