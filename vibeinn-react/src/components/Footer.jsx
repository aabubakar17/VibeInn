import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { Container } from "@mantine/core";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="text-black">
      <div className="flex justify-center items-center space-x-4 my-2">
        <a
          title="Linkedin Profile"
          href="https://www.linkedin.com/in/abubakar-abubakar-46a9141a1/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-blue-500"
        >
          <FaLinkedin className="w-6 h-6" />
        </a>
        <a
          title="Github Profile"
          href="https://github.com/aabubakar17"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-500"
        >
          <FaGithub className="w-6 h-6" />
        </a>
      </div>
      <p className="text-center mb-1">Connect with me on LinkedIn and GitHub</p>
      <p className="text-center">
        &copy; {new Date().getFullYear()} Abubakar Abdihakim Abubakar All rights
        reserved.
      </p>
    </div>
  );
};

export default Footer;
