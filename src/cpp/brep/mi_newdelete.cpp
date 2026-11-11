// Route every C++ new/delete in the process (web-ifc's and the kernel's alike) through mimalloc,
// when the bench is built with BREP_MIMALLOC. Both paths get the same allocator, so the comparison
// stays fair; what changes is how much the allocator costs the allocation-heavy boolean.
#ifdef BREP_MIMALLOC
#include <mimalloc-new-delete.h>
#endif
