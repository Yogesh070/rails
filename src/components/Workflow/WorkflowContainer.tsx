import { CSS } from '@dnd-kit/utilities';
import type { UniqueIdentifier } from '@dnd-kit/core';

import type {
    AnimateLayoutChanges} from '@dnd-kit/sortable';
import {
    useSortable,
    defaultAnimateLayoutChanges,
} from '@dnd-kit/sortable';
import type { ContainerProps } from '../Container/Container';
import Container from '../Container/Container';
import type { Issue } from '@prisma/client';

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export default function WorkflowContainer({
    children,
    columns = 1,
    disabled,
    id,
    items,
    style,
    hasAdd,
    ...props
}: ContainerProps & {
    disabled?: boolean;
    id: UniqueIdentifier;
    items: Issue[];
    style?: React.CSSProperties;
}): JSX.Element {
    const {
        active,
        attributes,
        isDragging,
        listeners,
        over,
        setNodeRef,
        transition,
        transform,
    } = useSortable({
        id,
        data: { type: 'container', children: items },
        animateLayoutChanges,
    });
    const isOverContainer = over
        ? (id === over.id && active?.data.current?.type !== 'container') ||
        items.map(item=>item.id).includes(over.id as string)
        : false;

    return (
        <Container
            ref={disabled ? undefined : setNodeRef}
            style={{
                ...style,
                transition,
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0.5 : undefined,
            }}
            hover={isOverContainer}
            handleProps={{
                ...attributes,
                ...listeners,
            }}
            columns={columns}
            {...props}
            hasAdd={hasAdd}
        >
            {children}
        </Container>
    );
}
