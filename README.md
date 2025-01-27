# Terrain Visualizer

### **⚠️This is a work in progress. Stay tuned.⚠️**

> Visualizing an arbitrary terrain with React and React-three-fiber (Three.js).

![Terrain Visualizer demo](https://github.com/travistang/terrain-visualizer/blob/main/resources/screenshots/terrain-visualizer-demo.gif)

## Overview

As a hiking enthusiast I would like to document my hikes in an interesting and engaging way. I have always imagined to visualize my hiking trips similar to what [Relive](https://www.relive.cc/) offers. However I would like to do this with style as well as to embed it to a future hiking platform / journal that I will work on, so I created this little application to test the idea, and hopefully it would be exported as an npm package for my other projects / everyone who are interested to use.

## The idea

I would like to have an interactive 3D map to show the terrain around the route of hikes I planned / have done, so that I can show

- What we are up against (terrain, ascent, descent)
- What are the resources around the route (huts, water, towns, public transport stations etc.)
- Point of interest (Critical part of the hike, the summit cross)

Of course I would also like to make animations based on this great 3D visualization, but since the algorithm (especially involving the camera orientation) isn't that trivial to me, I would first focus on positioning this work as a information display library with 3D interaction capabilities.

## How to see a demo

Of course, first clone the repository:

`git clone https://github.com/travistang/terrain-visualizer`

Then install the dependencies

`cd terrain-visualizer && npm install`

Then run build and run it

`npm run build && npm run preview`

Then you should see the app at `localhost:4173`

You should see there are 3 buttons on the upper left side inside a big blank page. **That's expected because you need to get some data for the visualization to work.**

You will need to upload [GeoTIFF](https://en.wikipedia.org/wiki/GeoTIFF) file using the top-most button (with the map logo). For your convenience I have uploaded a terrain scan around [Zugspitze](https://en.wikipedia.org/wiki/Zugspitze) by [NASA](https://lpdaac.usgs.gov/products/srtmgl3v003/) which you can find [here](https://github.com/travistang/terrain-visualizer/resources/).

After that you should see a 3D terrain loaded (if not, try zooming out with your mouse wheel). Then you can proceed to click the second button to upload a [GPX file](./resources/gpx/zugspitze_and_wank.gpx) I prepared that contains one of the hiking routes I have done (Zugspitze via Stopselzieher and down via Reintal, then to Wank (1780m) and down to Garmisch)

And you should see a glowing yellow line that's snugged on the terrain, with a glowing red dot which is the Zugspitze Gipfel!

To navigate around:

- Click and drag with left mouse click with rotate the camera.
- Click and drag with right mouse click to pan
- Mouse wheel to zoom

_Note_: I haven't tested this on mobile device so I'm not sure how it would react to gestures. As I mentioned this is a work in progress and many things are to be developed and subject to change.

## Technology Stack

- React-Three-Fiber: The 3D visualization
- TypeScript
- Vite: Build tool
- Jest: Unit testing

## Road map

- [x] Terrain visualization
- [x] Point visualization and styling
- [ ] City visualization
- [ ] Animating point along the GPX routes
- [ ] Mouse handlers on the terrain
- [ ] Animation recording and camera motion planning
