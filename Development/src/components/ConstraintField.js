import React from 'react';
import get from 'lodash/get';
import { Typography } from '@material-ui/core';

const renderConstraintValue = value => {
    return value.numerator
        ? `${value.numerator} : ${value.denominator ? value.denominator : 1}`
        : value;
};

const ConstraintField = ({ record, source }) => {
    const constraint = get(record, source);
    const minConstraint = get(constraint, 'minimum');
    const maxConstraint = get(constraint, 'maximum');
    const enumConstraint = get(constraint, 'enum');
    return (
        <>
            {(minConstraint != null || maxConstraint != null) && (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {minConstraint != null && (
                        <Typography variant="body2">
                            {renderConstraintValue(minConstraint)}
                        </Typography>
                    )}
                    <Typography variant="body2">&ndash;</Typography>
                    {maxConstraint != null && (
                        <Typography variant="body2">
                            {renderConstraintValue(maxConstraint)}
                        </Typography>
                    )}
                </div>
            )}
            {enumConstraint != null && (
                <Typography variant="body2">
                    {enumConstraint
                        .map(item => renderConstraintValue(item))
                        .join(', ')}
                </Typography>
            )}
        </>
    );
};

ConstraintField.defaultProps = {
    addLabel: true,
};

export default ConstraintField;
