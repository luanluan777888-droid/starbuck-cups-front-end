import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { adminStore } from "./adminStore";
import { publicStore } from "./publicStore";

export { adminStore, publicStore };

// Backward compatibility for modules that read store directly (admin auth/token flow).
export const store = adminStore;

export type RootState = ReturnType<typeof adminStore.getState>;
export type AppDispatch = typeof adminStore.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
