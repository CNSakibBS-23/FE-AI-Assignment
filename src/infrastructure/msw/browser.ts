import { setupWorker } from "msw/browser";
import { handlers } from "@/infrastructure/msw/handlers";

export const worker = setupWorker(...handlers);
