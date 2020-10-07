#include "farm_ng/calibration/pose_utils.h"

#include <glog/logging.h>
namespace farm_ng {
std::string FrameNameNumber(const std::string& name, int number) {
  char buffer[1024];
  CHECK_LT(
      std::snprintf(buffer, sizeof(buffer), "%s/%05d", name.c_str(), number),
      int(sizeof(buffer)));
  return std::string(buffer);
}

// Constructs a frame name of a tag associated with a rig in the form
// <rig_name>/tag/<tag_id %05d>
std::string FrameRigTag(const std::string& rig_name, int tag_id) {
  return FrameNameNumber(rig_name + "/tag", tag_id);
}

bool StartsWith(const std::string& x, const std::string& prefix) {
  return x.rfind(prefix, 0) == 0;
}
}  // namespace farm_ng
