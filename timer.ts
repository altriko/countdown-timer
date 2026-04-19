// 4 possible state of the timer
type TimerState = "idle" | "running" | "paused" | "done" // this is called union, so it will only have these values instead


// Represents the poin in time (the minute and seconds)
interface TimerDuration { // using interface so it'll be object shapes
    "minutes": number, // 0 - 99
    "seconds": number, // 0 - 59
}


// Source of truth of the full application state (based on the interface)
export interface AppState {
    state: TimerState,
    initialDuration: TimerDuration, // initial time originally
    remaining: TimerDuration, // remaining time
    intervalId: number | null    // set interval, null if nothing created. number => timer is running, ID stored here, null => when it's not running (idle, paused, done), no interval
}





//FUNCTIONS
// Convert TimerDuration -> total seconds
export function toSeconds(duration: TimerDuration): number {
    return (duration.minutes * 60) + duration.seconds
}

// Convert total seconds -> Timer Duration (for display)
export function fromSeconds(totalSeconds: number): TimerDuration{
    var seconds_ = totalSeconds % 60
    var minutes_ = Math.floor(totalSeconds/60)
    return {
        minutes: minutes_,
        seconds: seconds_
    }
}

// Format the display into "MM:SS" str
export function formatDisplay(duration: TimerDuration): string {
    return String(duration.minutes + ":" + duration.seconds)
}

// Validate the user input
// Validate if seconds >59 & duration is 00:00 | qn: why create two validation here? why we don't split into 2 separate validation func?
export function isValidDuration(duration: TimerDuration): boolean {
    if (duration.minutes == 0 && duration.seconds == 0) {
        return false
    } if (duration.seconds >59) {
        return false
    } else {return true} //need to define the else state, otherwise undefined
}

// Decrease the 1 second each time, returns new time (but it doesn't know when is the 1 sec)
export function tick(remaining: TimerDuration): TimerDuration {
    let int: number = toSeconds(remaining)
    int -= 1 // decrease by 1 second (as it's alrd converted as sec)
    return fromSeconds(int)
}

// Render to the DOM based on the AppState
// Responsible for: display value, button visibility, status message
export function render(state: AppState): string { // should change to :void on the output
    const timeDisplay = formatDisplay(state.remaining)
    const statusMessage = state.state

    return("time: " + timeDisplay + " | status: " + statusMessage)
}

//Button Functions
export function handleStart(state: AppState): void {
    // steps:
    // - read current timer display
    // - run the loop for the tick (with interval 1 second)
    // - return the current after the tick (no need, as long as it reads the current_)
    let current_ = state.initialDuration
    
    const intervalID = setInterval(() => {
        current_ = tick(current_)
        state.remaining = current_
        console.log(current_)

        if (toSeconds(current_) <=0) {
            clearInterval(intervalID)
        }
    } ,1000) // 1 second interval

    state.intervalId = intervalID
    state.state = "running"
}

    // this is wrong as this is automatically runs, no waiting 1 seconds
//     do {
//         current_ = tick(current_)
//         console.log(current_)
//     } while (toSeconds(current_) > 0)
// }



export function handlePause(state: AppState): void {
    // steps:
    // - read the current intervalID
    // - pause the loop (clearInterval)
    clearInterval(state.intervalId)
    state.intervalId = null
    state.state = "paused"

}



export function handleResume(state: AppState): void {
    // steps:
    // - read the current intervalID
    // - resume based on the start button
    // - update the state
    let current_ = state.remaining
    
    const intervalID = setInterval(() => {
        current_ = tick(current_)
        console.log(current_)

        if (toSeconds(current_) <=0) {
            clearInterval(intervalID)
        }
    } ,1000) // 1 second interval

    state.intervalId = intervalID
    state.state = "running"
    

}






// function handleReset(): void 


