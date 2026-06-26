# App Structure

To keep the application scalable and intuitive, we should break it down into four core logical domains.

## The Canvas Space (The Playground)

This is the core interaction zone, functioning like an infinite whiteboard.

- Spatial Engine: Handles panning, zooming, and the coordinate system for placing items.
- Object Manipulation: Drag-and-drop support for pasting images, resizing, rotating, and grouping items.
- Annotation Layer: Freehand drawing, text boxes, and sticky notes that can be anchored to specific reference images.

## The Asset Manager (The Library)

This runs behind the scenes of the canvas, managing the metadata of everything the user pastes.

- Tagging & Categorization: A system to apply tags (e.g., "anatomy", "lighting", "color palettes") and filter the canvas or library by them.
- Local Storage Controller: Manages how images are saved locally so the app remains snappy. It handles naming conventions and organizes the files in the user's local directory without cluttering their OS.

## The Roadmap Engine (The Journey)

This is what sets your app apart from pure reference boards like PureRef or Milanote.

- Node-Based Skill Trees: Visual pathways for learning. For example, a predefined roadmap for character design might start with a node for basic anatomy, progress to shading, and culminate in a final anime-style illustration.
- Canvas Linking: The ability to attach specific reference boards to specific steps in the roadmap. Clicking "Color Theory" in the roadmap opens a dedicated canvas pre-populated with relevant notes and reference templates.
- Progress Tracking: Checkboxes or progress bars to mark milestones as completed.

## The UI/UX Shell

- Sidebar/Command Palette: For quickly switching between the Canvas view and the Roadmap view, searching tags, and accessing settings.
- Focus Mode: A toggle to hide all UI elements, leaving only the reference board visible to float alongside a primary painting application.
