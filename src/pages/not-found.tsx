import { PageLayout } from "@/ui/molecules/page-layout/page-layout"

export type NotFoundPageProps = {
  default?: boolean
}

const NotFoundPage = (_props: NotFoundPageProps) => {
  return (
    <PageLayout>
      <h1>Not Found</h1>
    </PageLayout>
  )
}

export default NotFoundPage
