const fs = require('fs');

async function testEndpoint() {
  console.log("Sending request to http://localhost:3005/api/videos...");
  
  const payload = {
    prompt: "A 10-second explainer on why AI is the future, with a bar chart showing growth.",
    videoType: "MotionGraphics",
    topic: "Technology",
    aspectRatio: "16:9",
    voice: "aura-2-aries-en"
  };

  try {
    const response = await fetch("http://localhost:3005/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("API Error:", data);
      return;
    }

    console.log("Job submitted successfully!");
    console.log("Job ID:", data.jobId);
    
    fs.writeFileSync(
      "test-output.json", 
      JSON.stringify(data.timeline, null, 2)
    );
    console.log("Timeline saved to test-output.json");
    
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

testEndpoint();
