# :punch: Pow!

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
<pow playernumber="0" data-array-buffer="data.arrayBuffer"></pow>
```

## Run the Demo
```bash
npm install
npm run demo
```

## Developing 
> This is very much a work in progress

To modify `player.html`:  
1. Make changes you desire  
2. Use [inline-css](http://templates.mailchimp.com/resources/inline-css/) to inline the css  
3. Copy the css-inlined HTML (only the div in the inline-css output, not the style tag)  
4. Use [HTML minify](http://www.willpeavy.com/minifier/) to minify the copied HTML  
5. Copy the minified CSS into `app.module.js` in place of the existing HTML on line `3`  
6. `npm run dev` to test your changes (updates the demo and starts a server)  
7. `npm run build` when you're done  
8. Commit according to the [contributing documentation](http://www.github.com/EuphonyInc/pow/blob/master/CONTRIBUTING.md)  
  
