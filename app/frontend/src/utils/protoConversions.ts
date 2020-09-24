import {
  Vec3 as Vec3Proto,
  Quaternion as QuaternionProto
} from "../../genproto/farm_ng_proto/tractor/v1/geometry";
import { Quaternion, Vector3 } from "three";

export function toVector3(v?: Vec3Proto): Vector3 {
  return v ? new Vector3(v.x, v.y, v.z) : new Vector3();
}

export function toQuaternion(q?: QuaternionProto): Quaternion {
  return q ? new Quaternion(q.x, q.y, q.z, q.w) : new Quaternion();
}
