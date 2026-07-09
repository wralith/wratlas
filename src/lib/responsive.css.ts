import { MOBILE_MAX, TABLET_MAX } from "./responsive"

export const mobile = `screen and (max-width: ${MOBILE_MAX}px)`
export const tablet = `screen and (min-width: ${MOBILE_MAX + 1}px) and (max-width: ${TABLET_MAX}px)`
export const desktop = `screen and (min-width: ${TABLET_MAX + 1}px)`
export const mobileAndTablet = `screen and (max-width: ${TABLET_MAX}px)`
export const tabletAndDesktop = `screen and (min-width: ${MOBILE_MAX + 1}px)`
