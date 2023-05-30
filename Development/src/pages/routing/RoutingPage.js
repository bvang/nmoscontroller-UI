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
import axios from 'axios';
import copy from 'copy-to-clipboard';

export const RoutingPage = props => {
    const [filter, setFilter] = useJSONSetting('Senders Filter');
    const [responseData, setResponseData] = useState(null);
    const [senderPaginationURL, setSenderPaginationURL] = useState(null);
    const [receiverPaginationURL, setReceiverPaginationURL] = useState(null);
    //const [senderSDPData, setSenderSDPData] = useState({ manifest_href: null });
    const {
        data: senderData,
        loaded: senderLoaded,
        pagination: senderPagination,
        url: senderURL,
    } = useGetList({
        ...props,
        resource: 'senders',
        filter,
        paginationURL: senderPaginationURL,
    });

    const sendernextPage = label => {
        setSenderPaginationURL(senderPaginationURL[label]);
    };

    const {
        data: receiverData,
        loaded: receiverLoaded,
        pagination: receiverPagination,
        url: receiverURL,
    } = useGetList({
        ...props,
        resource: 'receivers',
        filter,
        paginationURL: receiverPaginationURL,
    });

    const { data: devicesData } = useGetList({
        ...props,
        resource: 'devices',
        filter,
    });

    const receivernextPage = label => {
        setReceiverPaginationURL(receiverPaginationURL[label]);
    };

    if (!senderLoaded || !receiverLoaded) {
        return <Loading />;
    }

    const handleClick = async (manifestHref, id) => {
        const parts = manifestHref.split('/');
        const baseUrl = parts.slice(0, 3).join('/') + '/';
        const URL = `${baseUrl}x-nmos/connection/v1.1/single/senders/${id}/transportfile/`;
        fetch(URL)
            .then(response => response.text())
            .then(dataurl => {
                const data = dataurl.replace(/\n/g, '\n').replace(/"/g, '\\"');
                console.log(data);

                setResponseData(data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleClickCopy = async (deviceId, id) => {
        //CHERCHER L'URL DU RECEIVER
        //const notify = useNotify();
        console.log(devicesData.id); //test
        console.log(devicesData.label);
        /*if(deviceId = devicesData.id) {
            for every
        }*/
        //const URL = `${baseUrl}x-nmos/connection/v1.1/single/senders/${id}/transportfile/`;
        //URL = deviceData/$id.controls.href
        /*if (senderSDPData.manifest_href) {
            copy(senderSDPData.manifest_href).then(() => {
                console.log('Manifest href copied', responseData);
            });
            return;
        }

        try {
            const response = await axios.get(senderData.manifest_href);
            const data = response.data;
            setSenderSDPData({ manifest_href: data });
            copy(data).then(() => {
                console.log('Manifest href copied');
            });
        } catch (error) {
            console.error(error);
        }*/

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
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                            >
                                                Sources
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {senderData.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                <Card sx={{ maxWidth: 100 }}>
                                                    <CardActionArea
                                                        onClick={() =>
                                                            handleClick(
                                                                item.manifest_href,
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <CardContent>
                                                            <Typography>
                                                                {item.label}
                                                            </Typography>
                                                            <Typography>
                                                                {
                                                                    item.manifest_href
                                                                }
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
                    </List>
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
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                            >
                                                Destinations
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {receiverData.map(item1, index => (
                                        const item2 = devicesData[index];
                                        <TableRow key={index}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                <Card sx={{ maxWidth: 100 }}>
                                                    <CardActionArea
                                                        onClick={() =>
                                                            handleClickCopy(
                                                                //URL = deviceData/$id.controls.href
                                                                item1.device_id,
                                                                item1.id
                                                            )
                                                        }
                                                    >
                                                        <CardContent>
                                                            <Typography>
                                                                {item1.label},
                                                            </Typography>
                                                            <Typography>
                                                                {
                                                                    {item2.id}
                                                                }
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
