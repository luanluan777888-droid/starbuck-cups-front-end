
import { useRef } from "react";
import { Provider } from "react-redux";
import { publicStore } from "@/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef(publicStore);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
