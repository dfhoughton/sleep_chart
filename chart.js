function drawChart(data, id,opts) {
  // pull out some things of general interest
  // default options
  if ( opts == null ) {
    opts = {
      width: Math.round( data.length / 20 ),
    }
  }
  const {width,goal} = opts;
  if (goal == null) goal = 7;
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
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,c.width, c.height);

  function drawHorizontalMarker(y, color, label) {
    ctx.beginPath();
    let v = margin + ( mx - y ) * vwidth;
    ctx.moveTo(margin, v);
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.lineTo(margin + chartWidth, v);
    ctx.stroke();
    ctx.font = "10px Arial";
    ctx.textAlign = "right";
    ctx.fillText(Math.round(y * 10)/10, margin-6, v);
    ctx.textAlign = "left";
    ctx.fillText(label, c.width - margin + 6, v);
  }
  drawHorizontalMarker(avg, 'red', 'avg');
  drawHorizontalMarker(goal, 'green', 'goal');

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
    // let x = margin + hwidth;
    // y = margin + chartHeight;
    // for ( let i = 0; i < data.length; i += 1 ) {
    //   ctx.moveTo( x, y );
    //   ctx.lineTo( x, y + 5 );
    //   ctx.stroke();
    //   x += hwidth;
    // }
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
    ctx.fillText("Days",(c.width - margin)/2, c.height - margin + 26 );
    // y axis
    ctx.rotate(-Math.PI/2);
    ctx.fillText("Hours",-c.height/2,margin - 15);
    ctx.rotate(Math.PI/2);
    // max and min
    ctx.textAlign = 'right';
    ctx.font = '12 px Arial';
    ctx.fillText("0", margin - 8, c.height - margin);
    ctx.fillText(mx, margin - 8, margin + 5);
    ctx.textAlign = 'center';
    ctx.fillText(1, margin, c.height - margin + 16);
    ctx.fillText(data.length, margin + chartWidth, c.height - margin + 16);
  }
  drawAndLabelAxes();
  var smoothed = smooth(data, c.width - 2 * margin, { width: width});

  // *now* draw dots and whatnot
  const hstretcher = chartWidth / smoothed.length;
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
    if (r != null) {
      ctx.beginPath();
      ctx.strokeStyle = ctx.fillStyle = 'blue';
      x = margin + hstretcher * i, y = margin + chartHeight - r * vwidth;
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
