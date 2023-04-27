/*import {
    Card,
    CardContent,
    //List,
    //ListItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    //TextField,
    //withStyles,
} from '@material-ui/core';
import { ShowButton, Title } from 'react-admin';
import useGetList from '../../components/useGetList';

/*const StyledListItem = withStyles(theme => ({
    root: {
        justifyContent: 'center',
    },
}))(ListItem);

const StyledTextField = withStyles(theme => ({
    root: {
        width: 450,
    },
}))(TextField);

const StyledDivider = withStyles(theme => ({
    root: {
        width: 450,
    },
}))(Divider);

const selectOnFocus = event => event.target.select();

const RoutingPage = props => {
    const { data } = useGetList({
        ...props,
    });

    return (
        <div style={{ paddingTop: '24px' }}>
            <Card>
                <Title title={'Routing'} />
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{
                                        paddingLeft: '32px',
                                    }}
                                >
                                    Sources
                                </TableCell>
                                <TableCell>Add Filters</TableCell>
                                <TableCell>Search name...</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell component="th" scope="row">
                                        <ShowButton
                                            style={{
                                                textTransform: 'none',
                                            }}
                                            basePath="/senders"
                                            record={item}
                                            label={item.label}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoutingPage;*/
import React, { useState } from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    List,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import { Loading, Title } from 'react-admin';
//import ActiveField from '../../components/ActiveField';
import FilterPanel, {
    AutocompleteFilter,
    BooleanFilter,
    StringFilter,
} from '../../components/FilterPanel';
import {
    TRANSPORTS,
    parameterAutocompleteProps,
} from '../../components/ParameterRegisters';
import PaginationButtons from '../../components/PaginationButtons';
import ListActions from '../../components/ListActions';
import useGetList from '../../components/useGetList';
import { queryVersion, useJSONSetting } from '../../settings';

const RoutingPage = props => {
    const [filter, setFilter] = useJSONSetting('Senders Filter');
    /*const [paginationURL, setPaginationURL] = useState(null);
    const { data, loaded, pagination, url } = useGetList({
        ...props,
        filter,
        paginationURL,
    });
    if (!loaded) return <Loading />;

    const nextPage = label => {
        setPaginationURL(pagination[label]);
    };*/
    const [senderPaginationURL, setSenderPaginationURL] = useState(null);
    const [receiverPaginationURL, setReceiverPaginationURL] = useState(null);
    const { data: senderData, loaded: senderLoaded, pagination: senderPagination, url: senderURL } = useGetList({
        ...props,
        resource : 'senders',
        filter,
        paginationURL: senderPaginationURL,
    });
    if (!senderLoaded) return <Loading />;

    const sendernextPage = label => {
        setSenderPaginationURL(senderPaginationURL[label]);
    };

    const { data: receiverData, loaded: receiverLoaded, pagination: receiverPagination, url: receiverURL } = useGetList({
        ...props,
         resource : 'receivers',
        filter,
        paginationURL: receiverPaginationURL,
    });
    if (!receiverLoaded) return <Loading />;

    const receivernextPage = label => {
        setReceiverPaginationURL(receiverPaginationURL[label]);
    };

    return (
        <>
            <div style={{ display: 'flex' }}>
                <span style={{ flexGrow: 1 }} />
                <ListActions url={senderURL} />
                <ListActions url={receiverURL} />
            </div>
            <Card>
                <Title title={'Routing'} />
                <CardContent>
                    <List>
                    <FilterPanel filter={filter} setFilter={setFilter}>
                        <StringFilter source="label" />
                        <StringFilter source="description" />
                        <AutocompleteFilter
                            source="transport"
                            {...parameterAutocompleteProps(TRANSPORTS)}
                        />
                        {queryVersion() >= 'v1.2' && (
                            <BooleanFilter
                                source="subscription.active"
                                label="Active"
                            />
                        )}
                        <StringFilter source="id" />
                    </FilterPanel>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        style={{
                                            paddingLeft: '32px',
                                        }}
                                    >
                                        Sources
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {senderData.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell component="th" scope="row">
                                            {item.label}
                                        </TableCell>
                                        <TableCell>
                                            <Card sx={{ maxWidth: 200 }}>
                                                <CardActionArea>
                                                    <CardContent>
                                                        <Typography
                                                            gutterBottom
                                                            variant="h5"
                                                            component="div"
                                                        >
                                                            Lizard
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br />
                    <PaginationButtons
                        pagination={senderPagination}
                        nextPage={sendernextPage}
                        {...props}
                    />
                    <FilterPanel filter={filter} setFilter={setFilter}>
                        <StringFilter source="label" />
                        <StringFilter source="description" />
                        <AutocompleteFilter
                            source="transport"
                            {...parameterAutocompleteProps(TRANSPORTS)}
                        />
                        {queryVersion() >= 'v1.2' && (
                            <BooleanFilter
                                source="subscription.active"
                                label="Active"
                            />
                        )}
                        <StringFilter source="id" />
                    </FilterPanel>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        style={{
                                            paddingLeft: '32px',
                                        }}
                                    >
                                        Destinations
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {receiverData.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell component="th" scope="row">
                                            {item.label}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br />
                    <PaginationButtons
                        pagination={receiverPagination}
                        nextPage={receivernextPage}
                        {...props}
                    />
                    </List>
                </CardContent>
            </Card>
        </>
    );
};

export default RoutingPage;
