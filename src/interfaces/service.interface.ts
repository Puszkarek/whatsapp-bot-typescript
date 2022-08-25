import { Contact } from "@open-wa/wa-automate";
import { Either } from "fp-ts/lib/Either";
import { MessageResponse } from "./message.interface";

export type ServiceMethodProps = {
  /** The message send by the user, excluding the command word */
  rawMessage: string;
  /** The user that sender the message */
  sender: Contact;
};
export type ServiceMethod = (
  props: ServiceMethodProps
) => Either<Error, MessageResponse>;

export type AsyncServiceMethod = (
  props: ServiceMethodProps
) => Promise<Either<Error, MessageResponse>>;
