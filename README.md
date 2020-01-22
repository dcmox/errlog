# errlog
Client-side error logger in JS

## Usage
```js
const saveLogFn = () => {
    // Post to endpoint to save logs
} 

let logger = new ErrLogger()
logger.init(saveLogFn)
logger.restore() // Disable logging and restore default window.onerror
```

## TODO 
* Capture screenshot
* Record mouse position when error occurred