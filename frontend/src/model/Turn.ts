import { type Point } from "./Point";

export interface Turn {
    from: Point,
    to: Point,
    path: Point[],
}
