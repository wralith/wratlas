import { useSignal } from "@preact/signals"
import * as styles from "../canvas-sidebar.css"
import { active_object, active_tool, sidebar_version } from "../state"
import { CopyDeleteActions } from "./actions"
import { OrderActions } from "./order"
import { ObjProperties } from "./properties"
import { RectToolOptions, TextToolOptions } from "./tool-options"

type Tab = "properties" | "order" | "actions"

const TABS: { id: Tab; label: string }[] = [
  { id: "properties", label: "Properties" },
  { id: "order", label: "Order" },
  { id: "actions", label: "Actions" },
]

const ObjectPanel = () => {
  sidebar_version.value
  const tab = useSignal<Tab>("properties")
  const obj = active_object.value
  if (!obj) return null

  return (
    <>
      <div class={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            class={`${styles.tabButton}${tab.value === t.id ? ` ${styles.tabActive}` : ""}`}
            onClick={() => {
              tab.value = t.id
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab.value === "properties" && <ObjProperties obj={obj} />}
      {tab.value === "order" && <OrderActions />}
      {tab.value === "actions" && <CopyDeleteActions />}
    </>
  )
}

export const CanvasSidebar = () => {
  const tool = active_tool.value
  const obj = active_object.value

  let content = null
  if (obj) content = <ObjectPanel />
  else if (tool === "text") content = <TextToolOptions />
  else if (tool === "draw") content = <RectToolOptions />

  return (
    <div
      class={styles.panel}
      data-tour="canvas-sidebar"
      style={!content ? { opacity: 0, pointerEvents: "none" } : undefined}
    >
      {content}
    </div>
  )
}
