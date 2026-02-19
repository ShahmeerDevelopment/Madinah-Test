"use client";

import PropTypes from "prop-types";
import * as React from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import { FixedSizeList as List } from "react-window";
import { theme } from "@/config/customTheme";

export default function MenuBtnComponent({
	options,
	getSelection,
	children,
	disabledCurrency = false,
}) {
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}
		prevOpen.current = open;
	}, [open]);

	// eslint-disable-next-line react/prop-types
	const Row = ({ index, style }) => (
		<MenuItem
			sx={style}
			key={options[index].value}
			onClick={(e) => {
				handleClose(e);
				getSelection(options[index].value);
			}}
		>
			{options[index].label}
		</MenuItem>
	);

	return (
		<>
			<Button
				variant="outlined"
				sx={{
					borderTopRightRadius: 0,
					borderBottomRightRadius: 0,
					borderTopLeftRadius: "16px",
					borderBottomLeftRadius: "16px",
					border: `1px solid ${theme.palette.primary.gray} `,
					borderRight: "0px",
				}}
				ref={anchorRef}
				id="composition-button"
				aria-controls={open ? "composition-menu" : undefined}
				aria-expanded={open ? "true" : undefined}
				aria-haspopup="true"
				onClick={handleToggle}
				disabled={disabledCurrency}
			>
				{children}
			</Button>
			<Popper
				open={open}
				anchorEl={anchorRef.current}
				role={undefined}
				placement="bottom-start"
				transition
				disablePortal
				sx={{ zIndex: "1000" }}
			>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin:
								placement === "bottom-start" ? "left top" : "left bottom",
						}}
					>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<div>
									<List
										height={200} // Adjust height for 6-7 items
										width={80} // Adjust width as needed
										itemCount={options.length}
										itemSize={35} // Adjust item size as needed
									>
										{Row}
									</List>
								</div>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</>
	);
}

MenuBtnComponent.propTypes = {
	children: PropTypes.any,
	getSelection: PropTypes.func,
	disabledCurrency: PropTypes.bool,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}),
	).isRequired,
};
