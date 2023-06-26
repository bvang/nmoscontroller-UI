import React, { useState } from 'react';
import {
    Button,
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
import { Loading, Title, useNotify } from 'react-admin';
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


export const RoutingList = props => {
    const [filter, setFilter] = useJSONSetting('Senders Filter');
    const [responseData, setResponseData] = useState(null);
    const [senderPaginationURL, setSenderPaginationURL] = useState(null);
    const [receiverPaginationURL, setReceiverPaginationURL] = useState(null);
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

    const notify = useNotify();

    if (!senderLoaded || !receiverLoaded) {
        return <Loading />;
    }

    const handleClick = async (manifestHref, id) => {
        const parts = manifestHref.split('/');
        const baseUrl = parts.slice(0, 3).join('/') + '/';
        const URL = `${baseUrl}x-nmos/connection/v1.1/single/senders/${id}/transportfile/`;
        fetch(URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Requete avec v1.1 a echoue');
                }
                return response.text();
            })
            .then(dataurl => {
                const data = dataurl.replace(/\n/g, '\n').replace(/"/g, '\\"');
                console.log(data);
                setResponseData(data);
                notify('SDP loaded');
            })
            .catch(error => {
                console.error(error);
                // Effectuer une deuxi�me requ�te avec v1.0
                const fallbackURL = `${baseUrl}x-nmos/connection/v1.0/single/senders/${id}/transportfile/`;
                fetch(fallbackURL)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Requ�te avec v1.0 a �chou�');
                        }
                        return response.text();
                    })
                    .then(dataurl => {
                        const data = dataurl
                            .replace(/\n/g, '\n')
                            .replace(/"/g, '\\"');
                        console.log(data);
                        setResponseData(data);
                    })
                    .catch(error => {
                        console.error(error);
                        // G�rer l'erreur de la deuxi�me requ�te
                    });
            });
    };

    const clearReceiver = async (id, desiredHref) => {
        const URL = `${desiredHref}single/receivers/${id}/staged/`;
        const requestBody = {
            activation: {
                mode: 'activate_immediate',
            },
            transport_file: {
                data: null,
                type: null,
            },
        };
        console.log(JSON.stringify(requestBody));
        fetch(URL, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                notify('Receiver cleared');
            })
            .catch(error => {
                console.error(
                    'Erreur lors de la mise a jour du contenu de lURL :',
                    error
                );
                notify('Error while clearing');
            });
    };

    function createMatchingCards(receiverData, devicesData) {
        const matchingItems = [];
        receiverData.forEach(item1 => {
            devicesData.forEach(item2 => {
                if (item1.device_id === item2.id) {
                    const data = item2.controls;
                    const desiredType = 'urn:x-nmos:control:sr-ctrl/v1.1';
                    const desiredHref = data.find(
                        obj => obj.type === desiredType
                    )?.href;
                    matchingItems.push(
                        <Card key={`${item1.device_id}-${item2.id}`}>
                            <CardActionArea
                                onClick={() =>
                                    handleClickCopy(
                                        //URL = deviceData/$id.controls.href
                                        item1.id,
                                        desiredHref
                                    )
                                }
                            >
                                <CardContent>
                                    <Typography variant="subtitle1">
                                        {item2.label}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {item1.label}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {desiredHref}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {item1.description}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        style={{
                                            color: '#ffffff',
                                            float: 'right',
                                        }}
                                        onClick={() =>
                                            clearReceiver(item1.id, desiredHref)
                                        }
                                    >
                                        Clear Receiver
                                    </Button>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    );
                }
            });
        });
        return matchingItems;
    }

    const handleClickCopy = async (id, desiredHref) => {
        //CHERCHER L'URL DU RECEIVER
        console.log(id); //test
        console.log(desiredHref);
        console.log(responseData);

        const URL = `${desiredHref}single/receivers/${id}/staged/`;
        //URL = deviceData/$id.controls.href
        if (responseData) {
            // Mettre � jour le champ "data" avec le contenu de l'URL
            const requestBody = {
                activation: {
                    mode: 'activate_immediate',
                },
                transport_file: {
                    data: responseData,
                    type: 'application/sdp',
                },
            };
            console.log(JSON.stringify(requestBody));

            // Effectuer la requ�te PATCH pour mettre � jour le contenu de l'URL
            fetch(URL, {
                //A REMETTRE POUR LE PATCH
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    notify('PATCH of SDP done');
                })
                .catch(error => {
                    console.error(
                        "Erreur lors de la mise � jour du contenu de l'URL :",
                        error
                    );
                });
        } else {
            console.error(
                "Aucun contenu � mettre � jour. Veuillez r�cup�rer le contenu de l'URL d'abord."
            );
        }
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
                                    {createMatchingCards(
                                        receiverData,
                                        devicesData
                                    ).map((card, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {card}
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

export default RoutingList;
