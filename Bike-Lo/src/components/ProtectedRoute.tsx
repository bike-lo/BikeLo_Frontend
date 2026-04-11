import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && user && adminOnly && user.role !== 'admin') {
      toast.error("Permission Denied", {
        description: "You do not have the required administrative privileges to access this page."
      });
    }
  }, [user, isLoading, adminOnly]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f7931e]/30 border-t-[#f7931e] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin-only check
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
