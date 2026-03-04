import AdminStoreProvider from "@/components/AdminStoreProvider";

export default function AdminLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminStoreProvider>{children}</AdminStoreProvider>;
}
