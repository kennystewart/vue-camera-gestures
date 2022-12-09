# Vue Camera Gestures

Let users control your Vue app using AI, their camera, and gestures of their choice in just 1 line of HTML!


## Installation
```bash
npm i vue-camera-gestures --save
```
Register the component globally
```js
import CameraGestures from 'vue-camera-gestures'
import 'vue-camera-gestures/dist/style.css'

app.component('camera-gestures', CameraGestures)
```

## Getting Started
```html
<camera-gestures @fancyGesture="doSomething()"></camera-gestures>
```
This will prompt the user to train and verify a 'Fancy Gesture'. When they perform this gesture the `doSomething()` method will be called.

The name and number of the events is completely configurable - subscribe to as many as you need.



