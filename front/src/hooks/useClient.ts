import { useState } from "react";
import { createUser } from "../api/client";

export function useClient() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const create = async () => {
      try {
        setLoading(true);
        setError(null);
        await createUser();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };
  
    return { create, loading, error };
}