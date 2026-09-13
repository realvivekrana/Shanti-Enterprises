// ============================================================
// SHANTI ENTERPRISES
// Accounts Nav
// Connects Users (management) <-> My Profile (admin account)
// ============================================================

import { Link } from "react-router-dom";

import {
  User,
  Users,
} from "lucide-react";

import "./AccountsNav.css";

// ============================================================
// STAGES
// ============================================================

const STAGES = [
  {
    key: "users",
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    key: "profile",
    label: "My Profile",
    path: "/admin/profile",
    icon: User,
  },
];

// ============================================================
// COMPONENT
// ============================================================

function AccountsNav({ active }) {
  return (
    <nav className="accounts-nav" aria-label="Accounts">
      <div className="accounts-nav-track">
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          const isActive = stage.key === active;

          return (
            <Link
              key={stage.key}
              to={stage.path}
              className={`accounts-nav-item ${
                isActive ? "is-active" : ""
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="accounts-nav-icon">
                <Icon size={16} strokeWidth={2.4} />
              </span>
              <span className="accounts-nav-label">
                {stage.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default AccountsNav;