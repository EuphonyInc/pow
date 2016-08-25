# :punch: Pow!
---
Pow! is an angular directive audio player for POST requested audio.

It helps you play audio that has been returned from a POST request or any source
of an audioBuffer. 

## Install from bower
```bash
bower install pow
```

## Usage
The `pow` directive takes one attribute, `array-buffer`, which is set to an
arrayBuffer representing the audio.

```html
<!-- in your view -->
<pow data-array-buffer="data.arrayBuffer"></pow>
```

## Run the Demo
```bash
npm install
npm run demo
```

Open browser to `localhost:3001`
