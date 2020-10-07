import * as React from "react";
import { ListChildComponentProps, FixedSizeList as List } from "react-window";
import { EventLogEntry } from "../../stores/ProgramsStore";
import { formatValue } from "../../utils/formatValue";
import styles from "./ProgramLog.module.scss";

interface IProps {
  eventLog: EventLogEntry[];
  selectedEntry: number | null;
  onSelectEntry: (index: number | null) => void;
}

const Row = ({
  eventLog,
  selectedEntry,
  onSelectEntry
}: IProps): React.FC<ListChildComponentProps> => ({ index, style }) => {
  const stableIndex = eventLog.length - 1 - index;
  const isSelected = selectedEntry === stableIndex;
  const event = eventLog[stableIndex];

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ): void => {
    e.preventDefault();
    onSelectEntry(selectedEntry === stableIndex ? null : stableIndex);
  };

  return (
    <div
      style={style}
      className={isSelected ? styles.selectedEntry : undefined}
    >
      <a href="#" onClick={handleClick}>{`[${formatValue(
        event.stamp
      )}] ${formatValue(event.name)}`}</a>
    </div>
  );
};

export const ProgramLog: React.FC<IProps & { height: number }> = (props) => {
  return props.eventLog.length > 0 ? (
    <List
      height={props.height}
      itemCount={props.eventLog.length}
      itemSize={15}
      width={"100%"}
      className={styles.programLog}
    >
      {Row(props)}
    </List>
  ) : null;
};
