import RouteGuard from "./RouteGuard";
import { Outlet } from "react-router-dom";

export default function PrivateRoute() {
  return (
    <RouteGuard requireAuth requireVerified requireOnboarded>
      <Outlet />
    </RouteGuard>
  );
}
