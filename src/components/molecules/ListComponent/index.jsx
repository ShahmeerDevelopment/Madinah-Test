/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
"use client";

import PropTypes from "prop-types";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ListItemButton } from "@mui/material";

const ITEMS = [
  {
    id: 0,
    secondaryActionIcon: <DeleteIcon />,
    label: "Primary Text",
  },
  {
    id: 1,
    secondaryActionIcon: <DeleteIcon />,
    label: "Primary Text",
  },
  {
    id: 2,
    secondaryActionIcon: <DeleteIcon />,
    label: "Primary Text",
  },
  {
    id: 3,
    secondaryActionIcon: <DeleteIcon />,
    label: "Primary Text",
  },
];

const ListItemComponent = ({
  withSecondaryAction,
  deleteAction,
  withIcon,
  secondaryActionIcon,
  icon,
  label,
  ...otherProps
}) => {
  return (
    <ListItem
      secondaryAction={
        withSecondaryAction ? (
          <IconButton
            onClick={() => deleteAction({ label, ...otherProps })}
            edge="end"
            aria-label="delete"
          >
            {secondaryActionIcon}
          </IconButton>
        ) : null
      }
    >
      {withIcon && icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={label} />
    </ListItem>
  );
};

ListItemComponent.propTypes = {
  deleteAction: PropTypes.any,
  icon: PropTypes.any,
  label: PropTypes.any,
  secondaryActionIcon: PropTypes.any,
  withIcon: PropTypes.any,
  withSecondaryAction: PropTypes.any,
};

export default function ListComponent({
  fullWidth = true,
  dense = true,
  withSecondaryAction = false,
  items = ITEMS,
  deleteAction = () => {},
  withIcon = false,
  clickable = false,
  clickAction = () => {},
}) {
  const itemProps = {
    withSecondaryAction,
    deleteAction,
    withIcon,
  };
  return (
    <List dense={dense} sx={{ width: fullWidth ? "100%" : "auto" }}>
      {items && items.length > 0 ? (
        <>
          {items.map((eachItem, index) => {
            return (
              <React.Fragment key={index}>
                {clickable ? (
                  <ListItemButton onClick={() => clickAction(eachItem)}>
                    <ListItemComponent {...itemProps} {...eachItem} />
                  </ListItemButton>
                ) : (
                  <ListItemComponent {...itemProps} {...eachItem} />
                )}
              </React.Fragment>
            );
          })}
        </>
      ) : null}
    </List>
  );
}

ListComponent.propTypes = {
  clickAction: PropTypes.func,
  clickable: PropTypes.bool,
  deleteAction: PropTypes.func,
  dense: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.any,
  id: PropTypes.number,
  items: PropTypes.array,
  label: PropTypes.string,
  secondaryActionIcon: PropTypes.any,
  withIcon: PropTypes.bool,
  withSecondaryAction: PropTypes.bool,
};
