import { Button } from '@material-ui/core';
import { includes, keys } from 'lodash';
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


export const PaginationButton = ({
    pagination,
    disabled,
    nextPage,
    rel,
    label = rel,
}) => {
    rel.toLowerCase();
    const buttons = keys(pagination);

    const enabled = (() => {
        if (disabled) return false;
        return includes(buttons, rel);
    })();

    const getIcon = label => {
        const ButtonIcon = components[label];
        return <ButtonIcon style={{ transform: 'rotate(270deg)' }} />;
    };

    return (
        <Button onClick={() => nextPage(rel)} disabled={!enabled}>
            {getIcon(rel)}
            {label}
        </Button>
    );
};

const PaginationButtons = props => (
    <>
        <PaginationButton rel="first" {...props} />
        <PaginationButton rel="prev" {...props} />
        <PaginationButton rel="next" {...props} />
        <PaginationButton rel="last" {...props} />
    </>
);

export default PaginationButtons;
