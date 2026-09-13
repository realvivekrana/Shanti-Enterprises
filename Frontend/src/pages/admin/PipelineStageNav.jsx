// ============================================================
// SHANTI ENTERPRISES
// Pipeline Stage Nav
// Connects Orders → RFQs → Quotations → Shipments as one flow
// ============================================================

import { Link } from "react-router-dom";

import {
  ClipboardList,
  FileText,
  Package,
  Truck,
} from "lucide-react";

import "./PipelineStageNav.css";

// ============================================================
// STAGES
// ============================================================

const STAGES = [
  {
    key: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: Package,
  },
  {
    key: "rfqs",
    label: "RFQs",
    path: "/admin/rfqs",
    icon: ClipboardList,
  },
  {
    key: "quotations",
    label: "Quotations",
    path: "/admin/quotations",
    icon: FileText,
  },
  {
    key: "shipments",
    label: "Shipments",
    path: "/admin/shipments",
    icon: Truck,
  },
];

// ============================================================
// COMPONENT
// ============================================================

function PipelineStageNav({ active }) {
  const activeIndex = STAGES.findIndex(
    (stage) => stage.key === active
  );

  return (
    <nav
      className="pipeline-nav"
      aria-label="Order pipeline"
    >
      <div className="pipeline-nav-track">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === activeIndex;
          const isDone =
            activeIndex >= 0 && index < activeIndex;

          return (
            <div
              className="pipeline-nav-step"
              key={stage.key}
            >
              <Link
                to={stage.path}
                className={`pipeline-nav-item ${
                  isActive ? "is-active" : ""
                } ${isDone ? "is-done" : ""}`}
                aria-current={
                  isActive ? "page" : undefined
                }
              >
                <span className="pipeline-nav-icon">
                  <Icon size={16} strokeWidth={2.4} />
                </span>
                <span className="pipeline-nav-label">
                  {stage.label}
                </span>
              </Link>

              {index < STAGES.length - 1 && (
                <span
                  className={`pipeline-nav-connector ${
                    isDone ? "is-done" : ""
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export default PipelineStageNav;