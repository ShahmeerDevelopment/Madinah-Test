"use client";

import React from "react";
// import users from './icons/users.svg';
import StackComponent from "../../atoms/StackComponent";
import SubHeading1 from "../../atoms/createCampaigns/SubHeading1";
// import TypographyComp from '../../atoms/typography/TypographyComp';
// import { theme } from '../../../config/customTheme';

const NoDataTable = () => {
  return (
    <StackComponent
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "253px" }}
    >
      <SubHeading1 align="center">No data</SubHeading1>
      {/* <TypographyComp
				sx={{
					marginTop: '5px !important',
					fontSize: '14px',
					lineHeight: '16px',
					textAlign: 'center',
					color: theme.palette.primary.gray,
				}}
			>
				When you add team members this information is displayed in this table
			</TypographyComp> */}
    </StackComponent>
  );
};

export default NoDataTable;
