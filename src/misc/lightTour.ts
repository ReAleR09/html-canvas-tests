import { Point } from "../models/Point";
import { getLightPoint } from "../objects";

const STEPS_FOR_POINT_TO_POINT = 100;
const getStepDiffs = (nextPoint: Point): [number, number, number] => {
    const set =  nextPoint.sub(lightPoint).mul(1/STEPS_FOR_POINT_TO_POINT);
    return [set.x, set.y, set.z];
}

const WAYPOINTS = [
    new Point(0, -5, 0), // down
    new Point(-5, 0, 0), // left
    new Point(0, 5, 0), // up
    new Point(5, 0, 0), // right
    new Point(0, -5, 0), // down
    new Point(0, 0, 5), // center far
    new Point(0, 5, 0), // up
    new Point(0, 0, -5), // center close
]

const lightPoint = getLightPoint(0);
let CURR_POINT_INDEX = 0;
let STEP_NUM = 0;
let stepDiffs: [number, number, number] = getStepDiffs(WAYPOINTS[CURR_POINT_INDEX]);


export const lightTour = () => {
    lightPoint.modify(...stepDiffs);
    STEP_NUM++;

    // We've reached the point, take next
    if (STEP_NUM === STEPS_FOR_POINT_TO_POINT) {
        CURR_POINT_INDEX++;
        // Go to first point
        if (CURR_POINT_INDEX === WAYPOINTS.length) {
            CURR_POINT_INDEX = 0;
        }
        STEP_NUM = 0;
        stepDiffs = getStepDiffs(WAYPOINTS[CURR_POINT_INDEX]);
    } 
}