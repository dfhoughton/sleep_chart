function drawChart(data, id) {
  // pull out some things of general interest
  const c = document.getElementById(id), ctx = c.getContext('2d');
  const margin = 40, chartWidth = c.width - 2 * margin, chartHeight = c.height - 2 * margin;
  var mx, avg = 0;
  for ( let v of data ) {
    avg += v;
    if ( mx == null || mx < v ) {
      mx = v;
    }
  }
  avg /= data.length;
  mx = Math.ceil(mx);
  const vwidth = chartHeight / mx;
  const hwidth = chartWidth / data.length;
  // paint canvas white
  ctx.beginPath();
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,c.width, c.height);

  function drawHorizontalMarker(y, color) {
    ctx.beginPath();
    y = margin + ( mx - y ) * vwidth;
    ctx.moveTo(margin, y);
    ctx.strokeStyle = color;
    ctx.lineTo(margin + chartWidth, y);
    ctx.stroke();
  }
  drawHorizontalMarker(avg, 'red');
  drawHorizontalMarker(7, 'green');

  function drawAndLabelAxes() {
    ctx.beginPath();
    ctx.strokeStyle = ctx.fillStyle = 'black';
    ctx.font = "10px Arial";
    // tics and labels
    let y = margin;
    for ( let i = 0; i < mx; i++ ) {
      ctx.moveTo( margin - 5, y);
      ctx.lineTo( margin, y);
      ctx.stroke();
      y += vwidth;
    }
    let x = margin + hwidth;
    y = margin + chartHeight;
    for ( let i = 0; i < data.length; i += 1 ) {
      ctx.moveTo( x, y );
      ctx.lineTo( x, y + 5 );
      ctx.stroke();
      x += hwidth;
    }
    // axes themselves
    ctx.strokeStyle = 'black';
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, c.height - margin);
    ctx.stroke();
    ctx.lineTo(c.width - margin, c.height - margin);
    ctx.stroke();
    // labels
    ctx.textAlign = 'center';
    ctx.font = "14px Arial";
    // x axis
    ctx.fillText("Days",(c.width - margin)/2, c.height - margin + 30 );
    // y axis
    ctx.rotate(-Math.PI/2);
    ctx.fillText("Hours",-c.height/2,margin - 15);
    ctx.rotate(Math.PI/2);
  }
  drawAndLabelAxes();
  var smoothed = smooth(data, c.width - 2 * margin );

  // *now* draw dots and whatnot
  const hstretcher = chartWidth / smoothed.length;
  ctx.beginPath();
  ctx.strokeStyle = 'grey';
  for ( let i = 0; i < smoothed.length; i++ ) {
    let s = smoothed[i][0];
    x = margin + hstretcher * i, y = margin + chartHeight - s * vwidth;
    if ( i == 0 ) {
      ctx.moveTo( x, y );
    } else {
      ctx.lineTo( x, y );
    }
  }
  ctx.stroke();
  // and the actual data points
  for ( let i = 0; i < smoothed.length; i++) {
    let r = smoothed[i][1];
    if (r) {
      ctx.beginPath();
      ctx.strokeStyle = ctx.fillStyle = 'blue';
      x = margin + hstretcher * i, y = margin + chartHeight - r * vwidth;
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}