import { useState } from "react";

function useInfoToggle(initialValue = null) {
  const [activeInfo, setActiveInfo] = useState(initialValue);

  function toggleInfo(key) {
    setActiveInfo((prev) => (prev === key ? null : key));
  }

  function closeInfo() {
    setActiveInfo(null);
  }

  return {
    activeInfo,
    toggleInfo,
    closeInfo,
  };
}

export default useInfoToggle;