/* eslint-disable react/prop-types */
import { Box, SvgIcon, Typography } from '@mui/material';
import { Group, PersonOff } from '@mui/icons-material';

const EmptyIllustration = ({ title, subtitle }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          textAlign: "center",
        }}
      >
        <SvgIcon
          sx={{ fontSize: "100px", color: "#1976d2", mb: 2 }}
          viewBox="0 0 24 24"
        >
          <Group />
          <PersonOff />
        </SvgIcon>
        <Typography variant="h6" sx={{ color: "#666", mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: "#999" }}>
          {subtitle}
        </Typography>
        {/* <Typography variant="body1" sx={{ color: "#999", mt: 2 }}>
          {cta}
        </Typography> */}
      </Box>
    );
  };

  export default EmptyIllustration;