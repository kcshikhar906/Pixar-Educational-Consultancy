// This is a wrapper layout that does not contain any auth logic.
// It simply renders its children.
// The auth logic is handled by the (protected) route group layout.
export default function RootAdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <>{children}</>;
  }
