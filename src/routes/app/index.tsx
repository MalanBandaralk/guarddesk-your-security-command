import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [
    { title: "Dashboard | GuardDesk" }, { name: "description", content: "GuardDesk live security operations overview." },
    { property: "og:title", content: "Dashboard | GuardDesk" }, { property: "og:description", content: "Live security operations overview." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Dashboard,
});