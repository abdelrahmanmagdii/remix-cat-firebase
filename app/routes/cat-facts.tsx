import { useEffect, useState } from "react";
import axios from "axios";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../firebaseConfig";

const db = getFirestore(app);

export default function CatFacts() {
    const [catFact, setCatFact] = useState<string>("Loading cat fact...");

    // Function to fetch and store a cat fact
    const fetchAndStoreCatFact = async () => {
        try {
            const response = await axios.get("https://catfact.ninja/fact");
            setCatFact(response.data.fact);

            // Store the fact in Firebase
            await addDoc(collection(db, "catFacts"), {
                fact: response.data.fact,
                timestamp: new Date()
            });
        } catch (error) {
            setCatFact("Failed to fetch a new cat fact.");
            console.error("Error fetching cat fact:", error);
        }
    };

    // Initial fetch when component mounts
    useEffect(() => {
        fetchAndStoreCatFact();
    }, []);

    return (
        <div>
            <h1>Cat Fact</h1>
            <p>{catFact}</p>
            <button onClick={fetchAndStoreCatFact}>Get New Fact</button>
        </div>
    );
}
