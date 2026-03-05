
import { useRef } from "react";
import { Provider } from "react-redux";
import { adminStore } from "@/store";

export default function AdminStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef(adminStore);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
