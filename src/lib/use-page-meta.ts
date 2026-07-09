import { useEffect } from "preact/hooks"

export const usePageMeta = (title: string, description?: string) => {
  useEffect(() => {
    document.title = title ? `Wratlas · ${title}` : "Wratlas"
    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute(attr, value)
    }
    setMeta('meta[name="description"]', "content", description ?? "Canvas editor for your creative workflow")
    setMeta('meta[property="og:title"]', "content", title)
    setMeta('meta[name="twitter:title"]', "content", title)
  }, [title, description])
}
