/** The command to trigger the message commands */
export const COMMAND_PREFIX = "!" as const;
/** The minimum size accept by a command name */
export const MIN_COMMAND_NAME_LENGTH = 3 as const;

export const COMMAND_ARGS_SEPARATOR = " " as const;

/**
 * For example, if the user wants to send two items `item one, item two`, the comma will be the regular way to split these items in a array of items
 */
export const MESSAGE_ITEM_SEPARATOR = "," as const;
