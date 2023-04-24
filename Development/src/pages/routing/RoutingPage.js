import {
    Card,
    CardContent,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    withStyles,
} from '@material-ui/core';
import { ShowButton, Title } from 'react-admin';
import {
    QUERY_API,
    disabledSetting,
    hiddenSetting,
} from '../../settings';
import useGetList from '../../components/useGetList';

const StyledListItem = withStyles(theme => ({
    root: {
        justifyContent: 'center',
    },
}))(ListItem);

const StyledTextField = withStyles(theme => ({
    root: {
        width: 450,
    },
}))(TextField);

/*const StyledDivider = withStyles(theme => ({
    root: {
        width: 450,
    },
}))(Divider);*/

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
                    <List>
                        {!hiddenSetting(QUERY_API) && (
                            <StyledListItem>
                                <StyledTextField
                                    label="Query API"
                                    variant="filled"
                                    onFocus={selectOnFocus}
                                    disabled={disabledSetting(QUERY_API)}
                                    helperText="Used to show the registered Nodes and their sub-resources"
                                />
                            </StyledListItem>
                        )}
                    </List>
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
        /*<div style={{ paddingTop: '24px' }}>
            <Card>
                <Title title={'Destinations'} />
                <CardContent>
                    <List>
                        {!hiddenSetting(QUERY_API) && (
                            <StyledListItem>
                                <StyledTextField
                                    label="Query API"
                                    variant="filled"
                                    value={values[QUERY_API]}
                                    onChange={handleTextChange(QUERY_API)}
                                    onFocus={selectOnFocus}
                                    disabled={disabledSetting(QUERY_API)}
                                    helperText="Used to show the registered Nodes and their sub-resources"
                                />
                            </StyledListItem>
                        )}
                        <StyledDivider />
                    </List>
                </CardContent>
            </Card>
        </div>*/
    );
};

export default RoutingPage;
