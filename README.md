# sleep chart

Something I made messing about with my kids or when I should have been sleeping. This is just
a pure-canvas line chart with a smoothing algorithm based on a rolling weighted average.
The weights are provided by a Gaussian, because why not?

If you open up the `smooth.html` file in a browser, you will see the chart. This has no
dependencies on other javascript libraries. Also, I can't promise this is the cleanest,
bestest javascript ever. I was a little lack-of-sleep-addled when I wrote it.

If you're interested in the snippet of precious medical information contained herein, go
nuts. Or maybe it's fake!

*Note*: If you push the smoothing number up really high you'll start to see floating point
overflow issues. In particular, the smoothed line will be a bit off the average line.