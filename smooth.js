var smooth = (function(){
  function gaussian(sigma) {
    var s2 = -1 / ( 2 * sigma ** 2 );
    return function(x) {
      return Math.exp( s2 * x ** 2 );
    };
  }
  return function (data, points, opts) {
    // we only interpolate if data doesn't provide as many points as we want
    if (data.length >= points.length) {
      return data;
    }
    // default options
    if ( opts == null ) {
      opts = {
        width: Math.round( data.length / 20 ),
      }
    }
    // pull values out of opts and sanitize them
    let {width} = opts;
    if ( width < 0 ) { // width is the number of data points to smooth together
      width = 0;
    }
    // now do linear interpolation between each pair of points
    const scale = Math.floor( points / data.length );
    const buffer = [];
    for (let i = 0, j = 0, lim = data.length - 1; i < lim; i++) {
      let base = data[i];
      buffer[j] = [ base, base ];
      j += 1;
      let delta = ( data[i+1] - data[i] ) / ( scale - 1 ), inc = delta;
      for (let k = 0, lim = scale - 1; k < lim; k++) {
        buffer[j] = [base + inc];
        j += 1;
        inc += delta;
      }
    }
    let finalDatum = data[data.length - 1];
    buffer[buffer.length - 1] = [finalDatum, finalDatum]; // include the last point
    // now make the gaussian smoother
    let halfWidth = Math.round( width * scale / 2 );
    if (halfWidth === 0) { // no smoothing
      return buffer;
    } else {
      const out = new Array(buffer.length);
      let g = gaussian( halfWidth / 2 ); // fit two standard deviations inside the gaussian
      let wavelet = new Array( halfWidth * 2 + 1 );
      wavelet[halfWidth] = g(0);
      for (let i = 0; i <= halfWidth; i++) {
        wavelet[ halfWidth - i ] = wavelet[ halfWidth + i ] = g(i);
      }
      // now do a gaussian smoothing of the interpolated data
      for (let i = 0; i < buffer.length; i++) {
        let s = 0, weights = 0;
        for (let j = i - halfWidth, k = 0, lim = Math.min( i + halfWidth, buffer.length); j < lim; j++, k++) {
          if (j >= 0) {
            let w = wavelet[k], b = buffer[j];
            weights += w;
            s += w * b[0];
          }
        }
        s /= weights;
        out[i] = [s, buffer[i][1]];
      }
      return out;
    }
  };
})();
