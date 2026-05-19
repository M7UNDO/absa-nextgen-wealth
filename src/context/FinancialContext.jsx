import { createContext, useContext, useEffect, useState } from "react";

const FinancialContext = createContext();

export function FinancialProvider({ children }) {
  const [financials, setFinancials] = useState(null);
  const [financialsLoading, setFinancialsLoading] = useState(true);

  useEffect(() => {
    const storedFinancials = localStorage.getItem("financials");

    if (storedFinancials) {
      setFinancials(JSON.parse(storedFinancials));
    }

    setFinancialsLoading(false);
  }, []);

  const saveFinancials = (data) => {
    localStorage.setItem("financials", JSON.stringify(data));
    setFinancials(data);
  };

  const clearFinancials = () => {
    localStorage.removeItem("financials");
    setFinancials(null);
  };

  return (
    <FinancialContext.Provider
      value={{
        financials,
        financialsLoading,
        saveFinancials,
        clearFinancials
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancials() {
  return useContext(FinancialContext);
}

export default FinancialContext;