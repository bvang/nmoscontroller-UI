import {
    Card,
    CardContent,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    List,
    ListItem,
    MenuItem,
    Switch,
    TextField,
    withStyles,
} from '@material-ui/core';
import { Title } from 'react-admin';


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

const StyledDivider = withStyles(theme => ({
    root: {
        width: 450,
    },
}))(Divider);


const selectOnFocus = event => event.target.select();

const RoutingPage = () => {
    const [values, setValues] = useSettingsContext();

    const handleTextChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    const handleBooleanChange = name => event => {
        setValues({ ...values, [name]: event.target.checked });
    };

    return (
        <div style={{ paddingTop: '24px' }}>
            <Card>
                <Title title={'Sources'} />
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
