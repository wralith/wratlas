import { Button } from "@/ui/atoms/button/button"
import { Flex } from "@/ui/atoms/flex/flex"
import { remove_active_object } from "../actions"
import * as styles from "../canvas-sidebar.css"
import { canvas_controller, fabric_canvas, sidebar_version } from "../state"

export const CopyDeleteActions = () => (
  <Flex direction="column" gap="xs">
    <Button
      variant="outline"
      size="small"
      class={styles.fontButton}
      onClick={() => {
        void canvas_controller.copy_image_to_clipboard()
      }}
    >
      Copy
    </Button>
    <Button
      variant="outline"
      size="small"
      color="danger"
      class={styles.fontButton}
      onClick={() => {
        const canvas = fabric_canvas.value
        if (!canvas) return
        remove_active_object(canvas)
        sidebar_version.value++
        void canvas_controller.save_state()
      }}
    >
      Delete
    </Button>
  </Flex>
)
