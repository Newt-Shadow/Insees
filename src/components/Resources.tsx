"use client";
import React, { useEffect, useState } from "react";
import ResourceAccordion from "./ResourceAccordion";
import styled from "styled-components";

const Wrapper = styled.div`
  background: black;
  min-height: 100vh;
  padding: 60px 20px;
  text-align: center;
  color: white;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #ccc;
  margin-bottom: 6px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #aaa;
  margin-bottom: 30px;
`;

type Semester = {
  title: string;
  files: { name: string; url: string }[];
};

const Resources: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("/api/resources");
        const data = await res.json();
        setSemesters(data.semesters); // matches your API shape
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      }
    };

    fetchResources();
  }, []);

  return (
    <Wrapper>
      <Title>Resources</Title>
      <Subtitle>
        Instrumentation and Electronics Engineering Society. <br />
        National Institute of Technology, Silchar.
      </Subtitle>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {semesters.map((sem, idx) => (
          <ResourceAccordion key={idx} title={sem.title} files={sem.files} />
        ))}
      </div>
    </Wrapper>
  );
};

export default Resources;
