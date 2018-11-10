# TOTC-Fishing


## Architecture

This is a HTML5 browser-based game, written entirely in JavaScript. The source code is directly readable in modern browsers supporting ECMAScript modules. We use Rollup to make a version for browsers without module support, Babel to support older browsers without recent JavaScript features, and UglifyJS to compress the JavaScript. 

A Gulp script automates the building process.


## Development

Install npm and gulp-cli if you don't have them.

Install ffmpeg for audio and video work. On Mac: `brew install ffmpeg --with-libvorbis --with-theora --with-libvpx`

Next, clone the repository and move to the directory where you cloned it. 

Install the dependencies with `npm install`. 

Use `gulp build` to compile to a version for older browsers in the `build` directory. Use `gulp watch` to automatically re-compile when you change a file. 

To generate minified version in the `dist` directory, use `gulp dist`.


### Audio

To convert voices, use a command like:

```
for wav in voices_src/fr/*.wav
do
  output_filename=$(basename $wav .wav)
  ffmpeg -y -i $wav audio/voices/fr/$output_filename.mp3
done
```


## Copyright

Copyright Jesse Himmelstein, 2017.


## License

Released under an MIT License.
