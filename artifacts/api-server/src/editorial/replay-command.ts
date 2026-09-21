import { replayEditorialAutomationRuns } from "./automation";

const report = await replayEditorialAutomationRuns();
console.log(JSON.stringify(report, null, 2));