#include "sampler.h"

#ifdef _WIN32
#include <windows.h>

#include <atomic>
#include <cstdint>
#include <fstream>
#include <thread>
#include <vector>

namespace brep::prof {

namespace {
std::atomic<bool> running{false};
std::thread worker;
std::string outPath;
std::vector<std::vector<uint32_t>> samples;
HANDLE target = nullptr;
uintptr_t imageBase = 0;

void loop() {
  CONTEXT ctx;
  while (running.load(std::memory_order_relaxed)) {
    Sleep(1);
    if (SuspendThread(target) == (DWORD)-1) continue;
    ctx = {};
    ctx.ContextFlags = CONTEXT_FULL;
    if (GetThreadContext(target, &ctx)) {
      std::vector<uint32_t> frames;
      for (int depth = 0; depth < 48 && ctx.Rip; depth++) {
        if (ctx.Rip >= imageBase && ctx.Rip - imageBase < 0x7fffffff) frames.push_back((uint32_t)(ctx.Rip - imageBase));
        DWORD64 base = 0;
        PRUNTIME_FUNCTION fn = RtlLookupFunctionEntry(ctx.Rip, &base, nullptr);
        if (!fn) {  // leaf function: return address is at RSP
          ctx.Rip = *(DWORD64*)ctx.Rsp;
          ctx.Rsp += 8;
        } else {
          PVOID handlerData = nullptr;
          DWORD64 establisher = 0;
          RtlVirtualUnwind(UNW_FLAG_NHANDLER, base, ctx.Rip, fn, &ctx, &handlerData, &establisher, nullptr);
        }
      }
      samples.push_back(std::move(frames));
    }
    ResumeThread(target);
  }
}
}  // namespace

void start(const std::string& path) {
  if (path.empty()) return;
  outPath = path;
  imageBase = (uintptr_t)GetModuleHandleW(nullptr);
  DuplicateHandle(GetCurrentProcess(), GetCurrentThread(), GetCurrentProcess(), &target,
                  THREAD_SUSPEND_RESUME | THREAD_GET_CONTEXT | THREAD_QUERY_INFORMATION, FALSE, 0);
  running = true;
  worker = std::thread(loop);
}

void stop() {
  if (!running) return;
  running = false;
  worker.join();
  std::ofstream o(outPath);
  for (const auto& s : samples) {
    for (size_t i = 0; i < s.size(); i++) o << (i ? " " : "") << std::hex << s[i];
    o << '\n';
  }
}

unsigned long long threadCycles() {
  ULONG64 c = 0;
  QueryThreadCycleTime(GetCurrentThread(), &c);
  return c;
}

}  // namespace brep::prof
#else
namespace brep::prof {
void start(const std::string&) {}
void stop() {}
unsigned long long threadCycles() { return 0; }
}  // namespace brep::prof
#endif
