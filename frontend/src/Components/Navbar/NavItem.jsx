import { memo } from 'react';
import { Link } from "react-router-dom";

const NavItem = memo(({ text, to }) => (
  <Link
    to={to}
    className="relative h-6 overflow-hidden group cursor-pointer"
  >
    <span className="block text-white transition-transform duration-300 group-hover:-translate-y-full">
      {text}
    </span>
    <span className="absolute left-0 top-full block text-red-600 transition-transform duration-300 group-hover:-translate-y-full">
      {text}
    </span>
  </Link>
));

export default NavItem;
