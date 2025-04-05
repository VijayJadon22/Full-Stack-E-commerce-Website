import { useEffect, useState } from "react"; // React hooks for state management and side effects
import axios from "../lib/axios.js"; // Axios instance for making API calls
import toast from "react-hot-toast"; // Library for showing toast notifications
import RecommendedItemCard from "./RecommendedItemCard.jsx"; // Component to render individual recommended items

// PeopleAlsoBought Component: Displays a list of recommended products based on user behavior or preferences
const PeopleAlsoBought = () => {
  // State to manage the list of recommendations
  const [recommendations, setRecommendations] = useState([]);

  // State to track the loading status
  const [isLoading, setIsLoading] = useState(true);

  // useEffect: Fetch recommended products when the component mounts
  useEffect(() => {
    // Function to fetch recommendations from the backend
    const fetchRecommendations = async () => {
      try {
        // Make an API call to get recommendations
        const res = await axios.get("/products/recommendations");

        // Update state with the fetched recommendations
        setRecommendations(res.data);
      } catch (error) {
        // Show an error message if the API call fails
        toast.error(
          error.response.data.message ||
            "An error occurred while fetching recommendations"
        );
      } finally {
        // Set loading state to false after fetching completes (success or failure)
        setIsLoading(false);
      }
    };

    // Call the function to fetch recommendations
    fetchRecommendations();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Conditional rendering for loading spinner (commented out here, but can be used if needed)
  // if (isLoading) return <LoadingSpinner />;

  // Render the UI
  return (
    <div className="hidden md:block mt-6">
      {" "}
      {/* Container visible only on medium screens and above */}
      {/* Header text */}
      <h3 className="text-2xl font-semibold text-gray-600">
        People also bought
      </h3>
      {/* Grid layout for displaying recommendations */}
      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {/* Map over the recommendations and render individual item cards */}
        {recommendations.map((product) => (
          <RecommendedItemCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought; // Export component for use elsewhere
