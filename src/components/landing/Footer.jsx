import Logo from "../../assets/images/edupeerhub-logo1.svg?react";

const Footer = () => {
  return (
    <footer className="bg-blue-50 px-10 py-12 mt-12">
      {/* Subscribe */}
      <div className="text-center mb-10">
        <p className="font-medium mb-4">Subscribe to our newsletter</p>
        <form className="flex justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-blue-400 text-black px-6 py-2 rounded hover:bg-white"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Footer Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-left">
        {/* Logo */}
        <div>
          <Logo />
          <h2 className="text-lg font-bold text-blue-400">EduPeerHub</h2>
          <p className="text-gray-600 text-sm">
            Connecting learners through peer tutoring.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <ul className="space-y-1">
            <li>
              <a href="/" className="hover:text-blue-400">
                About
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-400">
                Careers
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-400">
                Press
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Resources</h4>
          <ul className="space-y-1">
            <li>
              <a href="/" className="hover:text-blue-400">
                Blog
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-400">
                Guides
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-400">
                Support
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1">
            <li>
              <a href="/" className="hover:text-blue-400">
                Privacy
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-400">
                Terms
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <ul className="space-y-1">
            <li>
              <a href="/" className="hover:text-blue-400">
                Email
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-400">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-400">
                Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} EduPeerHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
