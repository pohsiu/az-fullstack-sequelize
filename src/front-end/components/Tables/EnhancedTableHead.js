import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';

export default class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { withDetail, withActions, columns, order, orderBy, sortTip } = this.props;

    return (
      <TableHead>
        <TableRow>
          {withDetail && <TableCell padding="checkbox"></TableCell>}
          {columns.map(column => {
            const sortProps = {};
            let lable = column.label;
            if(column.sortable !== false){
              sortProps.sortDirection = orderBy === column.id ? order : false;
              lable = (
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              );
            }

            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.padding || 'default'}
                className={column.cellClassName}
                {...sortProps}
              >
                {column.label && <Tooltip
                  title={sortTip}
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  {lable}
                </Tooltip>}
              </TableCell>
            );
          }, this)}
          {withActions && <TableCell padding="checkbox"></TableCell>}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  columns: PropTypes.array.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};
