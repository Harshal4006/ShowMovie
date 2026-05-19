import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { syncUser } from "../services/api";

const useUserSync = () => {
  const { isSignedIn, isLoaded, user, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const sync = async () => {
      try {
        const token = await getToken();
        await syncUser(token, {
          clerkId: user.id,
          name: user.fullName || user.firstName || user.username || "",
          email: user.primaryEmailAddress?.emailAddress || "",
        });
      } catch {
        // Sync failure is non-critical
      }
    };
    sync();
  }, [isLoaded, isSignedIn, user?.id, user?.fullName, user?.primaryEmailAddress?.emailAddress, getToken]);
};

export default useUserSync;