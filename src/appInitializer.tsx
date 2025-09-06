import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { FetchUrlFromFile } from "./reactConfig";

export default function AppInitializer({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      try {
        const url = await FetchUrlFromFile(); // fetch and store in context or global state
        console.log(url)
        setLoading(false);
      } catch (err) {
        // If fetching fails (e.g., not logged in), go to login
        console.log("There was an error fetching the data")
        navigate("/login", { replace: true });
      }
    }
    init();
    
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return children;
}