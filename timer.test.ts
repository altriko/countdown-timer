import * as Timer from "./timer.js" 
// import AppState from "./timer.js"

// TEST CASEs
// Initial Function
// console.log(Timer.toSeconds({minutes: 1, seconds: 30})) // expect: 90
// console.log(Timer.fromSeconds(70)) // expect {minutes: 1, seconds: 10}
// console.log(Timer.formatDisplay({minutes: 1, seconds: 30})) // expect 1:30
// console.log("failed: 1:99 | " + Timer.isValidDuration({seconds: 99, minutes: 1})) // expect false
// console.log("failed: 00:00 | " + Timer.isValidDuration({seconds: 0, minutes:0}))
// console.log("success 1:30 | " + Timer.isValidDuration({minutes: 1, seconds: 30}))
// console.log(JSON.stringify(Timer.tick({minutes: 1, seconds: 30})))
// console.log(Timer.render({
//     state: "running",
//     initialDuration:  {"minutes": 10, "seconds": 12},
//     remaining: {"minutes": 15, "seconds": 20}, // remaining time
//     intervalId: null    // set interval, null if nothing created. number => timer is running, ID stored here, null => when it's not running (idle, paused, done), no interval
// }))

//
const testState: AppState = {
    state: "running",
    initialDuration:  {"minutes": 2, "seconds": 12},
    remaining: {"minutes": 2, "seconds": 12}, // remaining time
    intervalId: null
}


console.log("Start Timer: ")
Timer.handleStart(testState)
console.log(testState.state)


setTimeout(() => {
    Timer.handlePause(testState)
    console.log("paused for 2 sec")
    console.log(testState.state)

    setTimeout(() => {
        Timer.handleResume(testState)
        console.log("resumed")
    }, 2000)
}, 3000)
