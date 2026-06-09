import { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Widget } from './Widget';

export const WidgetContainer = ({ onDrop, onHover, ...dragSourceProps }) => {
    const dragRef = useRef(null);

    const [{ isOver }, drop] = useDrop({
        accept: 'widget',
        drop: (droppedItem) => {
            onDrop({
                dragIndex: droppedItem.index, // 현재 drop된 index 전달
                hoverIndex: dragSourceProps.index, 
                dragId:droppedItem.id,
                hoverId:dragSourceProps.id,
            });
        },
        hover: (hoverWithItem) => {
            onHover({
                dragIndex: hoverWithItem.index, //현재 hover된 index전달
                hoverIndex: dragSourceProps.index,
            });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    },
        [dragSourceProps.index],
    );

    useEffect(() => { // 실제 실행문
        if (dragRef.current) drop(dragRef.current.getNode());
    }, [drop]);

    return (
        <Widget
            overStyle={isOver}
            ref={dragRef}
            {...dragSourceProps}
        />
    );
}