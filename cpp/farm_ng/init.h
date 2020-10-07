#ifndef FARM_NG_INIT_H_
#define FARM_NG_INIT_H_
#include <boost/asio/io_service.hpp>

#include "farm_ng/ipc.h"

namespace farm_ng {
void GlogFailureFunction();

int Main(int argc, char** argv, int (*main_func)(EventBus&),
         void (*cleanup_func)(EventBus&));

}  // namespace farm_ng

#endif
