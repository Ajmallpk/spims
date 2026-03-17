import { createContext, useContext, useState,useEffect } from "react";
import { registerSuspensionSetter } from "@/utils/suspensionHandler";
const SuspensionContext = createContext();

export function SuspensionProvider({ children }) {
const [isSuspended, setIsSuspended] = useState(false);
 useEffect(() => {
    registerSuspensionSetter(setIsSuspended);
  }, []);
return (
<SuspensionContext.Provider value={{ isSuspended, setIsSuspended }}>
{children}
</SuspensionContext.Provider>
);
}

export function useSuspension() {
return useContext(SuspensionContext);
}
