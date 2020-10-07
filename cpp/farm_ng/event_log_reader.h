#ifndef FARM_NG_EVENT_LOG_READER_H_
#define FARM_NG_EVENT_LOG_READER_H_
#include <memory>
#include <string>

#include "farm_ng_proto/tractor/v1/io.pb.h"
#include "farm_ng_proto/tractor/v1/resource.pb.h"
namespace farm_ng {
using farm_ng_proto::tractor::v1::Resource;
typedef farm_ng_proto::tractor::v1::Event EventPb;

class EventLogReaderImpl;
class EventLogReader {
 public:
  explicit EventLogReader(std::string log_path);
  explicit EventLogReader(Resource log_path);
  ~EventLogReader();

  void Reset(std::string log_path);

  EventPb ReadNext();

 private:
  std::unique_ptr<EventLogReaderImpl> impl_;
};

}  // namespace farm_ng

#endif
