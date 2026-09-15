import { useEffect, useState } from "react";
import practiceApi from "@/service/practiceurls";

const DeploymentPractice = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDeploymentData = async () => {
      try {
        const response = await practiceApi.getDeployment();

        console.log("API RESPONSE:", response.data);

        setData(response.data);
      } catch (error) {
        console.error("API ERROR:", error);
      }
    };

    fetchDeploymentData();
  }, []);

  return (
    <div>
      <h1>Deployment Practice</h1>

      {data && (
        <div>
          <p>{data.message}</p>
          <p>Version: {data.version}</p>
        </div>
      )}
    </div>
  );
};

export default DeploymentPractice;