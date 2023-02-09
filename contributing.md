Want to help out? See something to improve? Great! 

# Topics

Here's some stuff we need help on:

### Docs

* Documentation of typescript functions in web-ifc-api
* Documentation of cpp function calls, especially how to use IFCCloader and IFCGeometry Loader.
* More examples of how to use web-ifc, a few typescript examples can be found in main/examples/usage, but nothing yet for cpp

### IFC schema

* Geometry fixes for supported types. There's multiple problems with triangle winding, nested curves, etc

### Testing
* Manual verification of problems in the issue list, especially when it comes to regressions its very helpful to know when they occurred.
* Unit testing on the c++ side, code can be found in src/wasm/test/
* Unit testing on the TS side, there is no code for this currently, although there are example usages at main/examples/usage
* Performance benchmark versus other IFC loaders
* Correctness tests for IFC files and geometry.

### Performance

* Multi threaded geometry generation: WASM supports multi threading, and so does emscripten. The geometry code is fairly stateless so you can expect it to be easily parallizable and be much faster.
* Caching of duplicate geometries. Currently there is a disabled caching mechanism that avoids recalculating geometry for the same express ID. Unfortunately this currently balloons memory usage. Need to reconsider the implementation.
* Improve the performance of the boolean code. Currently there are two bool algos: a fast one and a correct one. We need to either make the fast one correct, or the correct one fast.


This list is pretty big, but not at all complete, there's much more things that could be improved! 
If you need help getting started come find us in the [discord channel](https://discord.gg/FXfyR4XrKT).

If you have an idea that's not on the list, please tell us about it so we can discuss if we want it in the repo.

# Process

We don't really have a fixed process yet, so don't worry to much. Just make sure we know what you're doing :)

Whenever you're ready, make a PR with a good name. We will take a look asap.

Thanks!
