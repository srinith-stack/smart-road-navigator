export const revalidate = 0
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import dynamicImport from "next/dynamic"

const DynamicNavigateView = dynamicImport(() => import("@/components/navigate-view"), {
  ssr: false,
  loading: () => <div className="h-[60dvh] w-full bg-muted" />,
})

export default function Page() {
  return <DynamicNavigateView />
}
