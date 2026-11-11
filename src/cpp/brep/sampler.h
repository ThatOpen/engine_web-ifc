#pragma once
// A tiny sampling profiler for Windows x64: a thread suspends the target thread every millisecond,
// unwinds its stack with the SEH tables and records the return addresses relative to the image
// base. stop() writes one sample per line ("rva rva rva ...", innermost first) for a symbolizer.

#include <string>

namespace brep::prof {

/** Start sampling the calling thread. No-op if `path` is empty. */
void start(const std::string& path);
/** Stop and write the samples. */
void stop();

}  // namespace brep::prof

namespace brep::prof {
/** CPU cycles this thread has actually run (not wall time): robust to other processes' load. */
unsigned long long threadCycles();
}  // namespace brep::prof
