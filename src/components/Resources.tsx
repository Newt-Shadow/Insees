"use client";
import React, { useEffect, useState } from "react";
import ResourceAccordion from "@/components/ResourceAccordion";
import styled from "styled-components";
import { Navbar } from "@/components/navbar";

const Wrapper = styled.div`
  background: #000;
  min-height: 100vh;
  padding: 80px 20px 40px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(180deg, #fff, #888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  letter-spacing: 0.03em;
  text-shadow: 0px 1px 3px rgba(255, 255, 255, 0.05),
    0 20px 60px rgba(0, 0, 0, 0.6);
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #aaa;
  margin-bottom: 40px;
  line-height: 1.6;
`;

// Types
type FileType = { name: string; url: string };
type Subject = { name: string; driveLink?: string; files: FileType[] };
type Semester = { title: string; subjects: Subject[] };

const Resources: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("/api/resources");
        const data = await res.json();
        setSemesters(data.semesters); // ✅ matches API shape
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      }
    };

    fetchResources();
  }, []);

  return (
    <>
      <Navbar />
      <Wrapper>
        <Title>Resources</Title>
        <Subtitle>
          Instrumentation and Electronics Engineering Society.
          <br />
          National Institute of Technology, Silchar.
        </Subtitle>

        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          {semesters.map((sem, idx) => (
            <ResourceAccordion
              key={idx}
              title={sem.title}
              subjects={sem.subjects} // ✅ fixed (was files)
            />
          ))}
        </div>
      </Wrapper>
    </>
  );
};

export default Resources;
