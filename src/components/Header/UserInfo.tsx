import React, { useEffect, useState } from "react";

interface Props {
  name: string;
  expiresAt: number;
}

export const UserInfo = ({ name, expiresAt }: Props) => {
  const [seconds, setSeconds] = useState(0);

  // effect to trigger a re-render of the component every second. (Would be a beautiful case to make a custom hook)
  useEffect(() => {
    const interval = setInterval(() => setSeconds(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-3">
      <div> {name} </div>
      <div>
        Token expires in: {getTimeUntilExpirationInSeconds(expiresAt)} seconds{" "}
      </div>
    </div>
  );
};

const getTimeUntilExpirationInSeconds = (
  expirationTimeAfterEpochInSeconds: number
) => Math.floor(expirationTimeAfterEpochInSeconds - Date.now() / 1000);
