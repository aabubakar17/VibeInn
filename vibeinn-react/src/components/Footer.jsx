import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="sticky bottom-0 mt-auto w-full bg-gray-400 text-white py-2">
      <div className="flex flex-col items-center justify-center">
        <div className="flex space-x-4 mb-2">
          <a
            title="Linkedin Profile"
            href="https://www.linkedin.com/in/abubakar-abubakar-46a9141a1/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-500"
          >
            <FaLinkedin className="w-6 h-6" />
          </a>
          <a
            title="Github Profile"
            href="https://github.com/aabubakar17"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-500"
          >
            <FaGithub className="w-6 h-6" />
          </a>
        </div>
        <p className="text-center mb-1">
          Connect with me on LinkedIn and GitHub
        </p>
        <p className="text-center">
          &copy; {new Date().getFullYear()} Abubakar Abdihakim Abubakar All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
