from typing import Dict

from farm_ng.tractor.sim.models.waypoint import Waypoint


class Database:
    """A mock database for prototyping."""

    def __init__(self):
        self._waypoints: Dict[int, Waypoint] = {}
        self._id = 0

    def _nextId(self):
        self._id += 1
        return self._id

    def saveWaypoint(self, waypoint):
        waypoint.id = self._nextId()
        self._waypoints[waypoint.id] = waypoint
        return waypoint

    def getWaypoint(self, waypoint_id):
        return self._waypoints.get(waypoint_id)

    def getAllWaypoints(self):
        return self._waypoints.values()

    def deleteWaypoint(self, waypoint_id):
        if waypoint_id not in self._waypoints:
            return False

        del self._waypoints[waypoint_id]
        return True


database = Database()
