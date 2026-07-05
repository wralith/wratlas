import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import * as styles from "../canvas-sidebar.css"
import { canvas_controller, fabric_canvas, sidebar_version } from "../state"

export const OrderActions = () => {
  sidebar_version.value
  const canvas = fabric_canvas.value
  if (!canvas) return null

  const objects = canvas.getObjects()
  const obj = canvas.getActiveObject()
  if (!obj) return null

  const idx = objects.indexOf(obj)

  return (
    <Flex direction="column" gap="xs">
      <span class={styles.label}>Order</span>
      <Flex gap="xs">
        <Button
          size="small"
          color="primary"
          variant="outline"
          disabled={idx >= objects.length - 1}
          class={styles.flexButton}
          onClick={() => {
            void canvas_controller.order_active_object_forward()
            sidebar_version.value++
          }}
        >
          Forward
        </Button>
        <Button
          size="small"
          color="primary"
          variant="outline"
          disabled={idx >= objects.length - 1}
          class={styles.flexButton}
          onClick={() => {
            void canvas_controller.order_active_object_to_front()
            sidebar_version.value++
          }}
        >
          Front
        </Button>
      </Flex>
      <Flex gap="xs">
        <Button
          size="small"
          color="primary"
          variant="outline"
          disabled={idx <= 0}
          class={styles.flexButton}
          onClick={() => {
            void canvas_controller.order_active_object_backward()
            sidebar_version.value++
          }}
        >
          Backward
        </Button>
        <Button
          size="small"
          color="primary"
          variant="outline"
          disabled={idx <= 0}
          class={styles.flexButton}
          onClick={() => {
            void canvas_controller.order_active_object_to_back()
            sidebar_version.value++
          }}
        >
          Back
        </Button>
      </Flex>
    </Flex>
  )
}
